const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../index');
const Note = require('../models/Note');

describe('Note App Integration Tests', function () {
	this.timeout(15000);

	const fakeUser = {
		id: 'testUserId',
		displayName: 'Test User',
	};

	const titlePrefix = `Test Note ${Date.now()}`;
	const searchPrefix = `Search Test ${Date.now()}`;

	before(async function () {
		await mongoose.connection.asPromise();
		app.request.isAuthenticated = () => true;
		app.request.user = fakeUser;
	});

	beforeEach(async function () {
		await Note.deleteMany({
			userId: fakeUser.id,
			title: { $regex: `^(${titlePrefix}|${searchPrefix}|Untitled note)` },
		});

		const searchNote = await Note.create({
			userId: fakeUser.id,
			title: `${searchPrefix} Seed`,
			content: '<p>Searchable seed note content</p>',
		});
	});

	after(async function () {
		await Note.deleteMany({
			userId: fakeUser.id,
			title: { $regex: `^(${titlePrefix}|${searchPrefix}|Untitled note)` },
		});
		await mongoose.disconnect();
	});

	describe('Notes CRUD Routes', function () {
		it('GET /notes returns the notes page for an authenticated user', async function () {
			const response = await request(app).get('/notes');

			expect(response.status).to.equal(200);
			expect(response.text).to.include('My Notes');
		});

		it('GET /notes/new returns the new note page', async function () {
			const response = await request(app).get('/notes/new');

			expect(response.status).to.equal(200);
			expect(response.text).to.include('Create Note');
		});

		it('GET /notes/:id/edit returns the edit page for an existing note', async function () {
			const existingNote = await Note.create({
				userId: fakeUser.id,
				title: `${titlePrefix} Edit Route`,
				content: '<p>Edit route content</p>',
			});

			const response = await request(app).get(`/notes/${existingNote._id}/edit`);

			expect(response.status).to.equal(200);
			expect(response.text).to.include('Edit Note');
			expect(response.text).to.include(`${titlePrefix} Edit Route`);
		});

		it('GET /notes/:id/edit redirects to /notes when note does not exist', async function () {
			const missingId = new mongoose.Types.ObjectId();
			const response = await request(app).get(`/notes/${missingId}/edit`);

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/notes');
		});

		it('GET /notes/:id/edit with an invalid ID returns 500', async function () {
			const response = await request(app).get('/notes/not-a-valid-id/edit');

			expect(response.status).to.equal(500);
			expect(response.text).to.include('Unable to load note');
		});

		it('POST /notes creates a note and redirects', async function () {
			const noteTitle = `${titlePrefix} Create`;
			const noteContent = '<p>Created note content</p>';

			const response = await request(app)
				.post('/notes')
				.type('form')
				.send({
					title: noteTitle,
					content: noteContent,
				});

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/notes');

			const savedNote = await Note.findOne({ userId: fakeUser.id, title: noteTitle }).lean();
			expect(savedNote).to.exist;
			expect(savedNote.content).to.include('Created note content');
			expect(savedNote.userId).to.equal(fakeUser.id);
		});

		it('GET /notes shows plain-text preview and not raw HTML tags', async function () {
			await Note.create({
				userId: fakeUser.id,
				title: `${titlePrefix} Preview`,
				content: '<p><strong>Preview</strong> plain test</p>',
			});

			const response = await request(app).get('/notes');

			expect(response.status).to.equal(200);
			expect(response.text).to.include('Preview plain test');
			expect(response.text).to.not.include('&lt;p&gt;');
			expect(response.text).to.not.include('&lt;strong&gt;');
		});

		it('POST /notes with an empty body creates a default untitled note', async function () {
			const response = await request(app)
				.post('/notes')
				.type('form')
				.send({});

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/notes');

			const savedNote = await Note.findOne({ userId: fakeUser.id, title: 'Untitled note' }).sort({ createdAt: -1 }).lean();
			expect(savedNote).to.exist;
			expect(savedNote.content).to.equal('');
		});

		it('PUT /notes/:id updates an existing note and redirects', async function () {
			const existingNote = await Note.create({
				userId: fakeUser.id,
				title: `${titlePrefix} Original`,
				content: '<p>Original content</p>',
			});

			const response = await request(app)
				.put(`/notes/${existingNote._id}`)
				.type('form')
				.send({
					title: `${titlePrefix} Updated`,
					content: '<p>Updated content</p>',
				});

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/notes');

			const updatedNote = await Note.findById(existingNote._id).lean();
			expect(updatedNote.title).to.equal(`${titlePrefix} Updated`);
			expect(updatedNote.content).to.include('Updated content');
		});

		it('PUT /notes/:id with an invalid ID returns 500', async function () {
			const response = await request(app)
				.put('/notes/not-a-valid-id')
				.type('form')
				.send({
					title: `${titlePrefix} Invalid`,
					content: '<p>Invalid update</p>',
				});

			expect(response.status).to.equal(500);
			expect(response.text).to.include('Unable to update note');
		});

		it('DELETE /notes/:id deletes a note and redirects', async function () {
			const existingNote = await Note.create({
				userId: fakeUser.id,
				title: `${titlePrefix} Delete`,
				content: '<p>Delete me</p>',
			});

			const response = await request(app)
				.delete(`/notes/${existingNote._id}`);

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.match(/^\/notes\?message=/);

			const deletedNote = await Note.findById(existingNote._id).lean();
			expect(deletedNote).to.equal(null);
		});

		it('DELETE /notes/:id with an invalid ID returns 500', async function () {
			const response = await request(app).delete('/notes/not-a-valid-id');

			expect(response.status).to.equal(500);
			expect(response.text).to.include('Unable to delete note');
		});
	});

	describe('Search Routes', function () {
		it('GET /notes/search?q=test returns a valid search page', async function () {
			await Note.create({
				userId: fakeUser.id,
				title: `${titlePrefix} NonMatching`,
				content: '<p>Should not match query</p>',
			});

			const response = await request(app).get(`/notes/search?q=${encodeURIComponent(searchPrefix)}`);

			expect(response.status).to.equal(200);
			expect(response.text).to.include('Search Results');
			expect(response.text).to.include(`${searchPrefix} Seed`);
			expect(response.text).to.not.include(`${titlePrefix} NonMatching`);
		});

		it('GET /notes/search with an empty query returns a valid page', async function () {
			const response = await request(app).get('/notes/search?q=');

			expect(response.status).to.equal(200);
			expect(response.text).to.include('Search');
		});
	});

	describe('Authentication Edge Cases', function () {
		beforeEach(function () {
			app.request.isAuthenticated = () => false;
			app.request.user = null;
		});

		afterEach(function () {
			app.request.isAuthenticated = () => true;
			app.request.user = fakeUser;
		});

		it('GET /notes redirects unauthenticated users to /', async function () {
			const response = await request(app).get('/notes');

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/');
		});

		it('GET /notes/new redirects unauthenticated users to /', async function () {
			const response = await request(app).get('/notes/new');

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/');
		});

		it('GET /notes/search redirects unauthenticated users to /', async function () {
			const response = await request(app).get('/notes/search?q=test');

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/');
		});

		it('POST /notes redirects unauthenticated users to /', async function () {
			const response = await request(app)
				.post('/notes')
				.type('form')
				.send({ title: 'Blocked', content: '<p>Blocked</p>' });

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/');
		});

		it('PUT /notes/:id redirects unauthenticated users to /', async function () {
			const response = await request(app)
				.put(`/notes/${new mongoose.Types.ObjectId()}`)
				.type('form')
				.send({ title: 'Blocked update', content: '<p>Blocked</p>' });

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/');
		});

		it('DELETE /notes/:id redirects unauthenticated users to /', async function () {
			const response = await request(app).delete(`/notes/${new mongoose.Types.ObjectId()}`);

			expect(response.status).to.equal(302);
			expect(response.headers.location).to.equal('/');
		});
	});
});


