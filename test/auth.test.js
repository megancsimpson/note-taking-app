const { expect } = require('chai');
const request = require('supertest');

const app = require('../index');

describe('Auth Router Integration Tests', function () {
  this.timeout(10000);

  it('GET /auth/google starts OAuth flow', async function () {
    const response = await request(app).get('/auth/google');

    expect(response.status).to.equal(302);
    expect(response.headers.location).to.be.a('string');
    expect(response.headers.location).to.include('accounts.google.com');
  });

  it('GET /auth/google/callback without code redirects to Google OAuth', async function () {
    const response = await request(app).get('/auth/google/callback');

    expect(response.status).to.equal(302);
    expect(response.headers.location).to.be.a('string');
    expect(response.headers.location).to.include('accounts.google.com');
  });

  it('GET /logout redirects to /', async function () {
    const response = await request(app).get('/logout');

    expect(response.status).to.equal(302);
    expect(response.headers.location).to.equal('/');
  });

  it('GET /auth/google/callback with provider error redirects safely', async function () {
    const response = await request(app).get('/auth/google/callback?error=access_denied');

    expect(response.status).to.equal(302);
    expect(response.headers.location).to.be.a('string');
    expect(
      response.headers.location === '/' || response.headers.location.includes('accounts.google.com')
    ).to.equal(true);
  });
});
