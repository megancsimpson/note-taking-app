const { expect } = require('chai');
const request = require('supertest');

const app = require('../index');

describe('About Route Integration Tests', function () {
  this.timeout(10000);

  it('GET /about returns the about page', async function () {
    const response = await request(app).get('/about');

    expect(response.status).to.equal(200);
    expect(response.text).to.include('<!DOCTYPE html>');
    expect(response.text).to.include('About');
  });

  it('GET /about renders key about-page content', async function () {
    const response = await request(app).get('/about');

    expect(response.status).to.equal(200);
    expect(response.text).to.include('Project Overview');
    expect(response.text).to.include('Key Features');
    expect(response.text).to.include('Technical Stack');
  });

  it('GET /about does not render removed Project Snapshot content', async function () {
    const response = await request(app).get('/about');

    expect(response.status).to.equal(200);
    expect(response.text).to.not.include('Project Snapshot');
  });

  it('POST /about returns 404 because only GET /about is supported', async function () {
    const response = await request(app).post('/about');

    expect(response.status).to.equal(404);
  });
});
