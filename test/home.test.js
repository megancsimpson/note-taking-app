const { expect } = require('chai');
const request = require('supertest');

const app = require('../index');

describe('Home Router Integration Tests', function () {
  this.timeout(10000);

  it('GET / returns the home page', async function () {
    const response = await request(app).get('/');

    expect(response.status).to.equal(200);
    expect(response.text).to.include('<!DOCTYPE html>');
    expect(response.text).to.include('Home');
  });

  it('GET /unknown-route returns 404', async function () {
    const response = await request(app).get('/unknown-route');

    expect(response.status).to.equal(404);
  });
});
