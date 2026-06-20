const { expect } = require('chai');
const request = require('supertest');

const app = require('../index');

describe('Admin Router Integration Tests', function () {
  this.timeout(10000);

  it('GET /admin returns 401 when token header is missing', async function () {
    const response = await request(app).get('/admin');

    expect(response.status).to.equal(401);
    expect(response.text).to.include('Unauthorized');
  });

  it('GET /admin returns 200 when token header is present', async function () {
    const response = await request(app)
      .get('/admin')
      .set('token', 'test-token');

    expect(response.status).to.equal(200);
    expect(response.text).to.include('Welcome Admin');
  });
});
