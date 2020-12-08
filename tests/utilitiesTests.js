/* eslint-disable camelcase */
/* eslint-disable no-loop-func */
const chai = require('chai');
const faker = require('faker');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const { describe } = require('mocha');

require(path.resolve('./index'));

chai.use(chaiHttp);
const apiBase = process.env.host_name;

module.exports = function () {
  describe('utilities testcases', () => {
    const title = faker.random.words(25);
    const pdf_url = faker.random.words(25);
    const author = faker.name.findName();
    const short_description = faker.random.words(60);
    const access_type = 'Private';

    it('check auth header check', done => {
      chai
        .request(apiBase)
        .post('/api/pdf')
        .send({ title, pdf_url, author, short_description, access_type })
        .then(res => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Authorization header not provided');
          done();
        });
    });

    it('success: check token not provided', done => {
      chai
        .request(apiBase)
        .post('/api/pdf')
        .set('Authorization', `Bearer`)
        .send({ title, pdf_url, author, short_description, access_type })
        .then(res => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Token not provided');
          done();
        });
    });

    it('success: check unauthroized token', done => {
      chai
        .request(apiBase)
        .post('/api/pdf')
        .set('Authorization', `Bearer ""`)
        .send({ title, pdf_url, author, short_description, access_type })
        .then(res => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Failed to authorize token');
          done();
        });
    });
  });
};
