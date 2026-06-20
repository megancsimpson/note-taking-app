const { expect } = require('chai');
const request = require('supertest');

const app = require('../index');

describe('Crash Router Integration Tests', function () {
  this.timeout(10000);

  it('GET /crash triggers centralized error handler', async function () {
    const response = await request(app).get('/crash');

    expect(response.status).to.equal(500);
    expect(response.body).to.be.an('object');
    expect(response.body.message).to.equal('Something broke');
  });
});
