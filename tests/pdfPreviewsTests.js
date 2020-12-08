/* eslint-disable camelcase */
/* eslint-disable no-loop-func */
const chai = require('chai');
const faker = require('faker');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { describe } = require('mocha');

require(path.resolve('./index'));

chai.use(chaiHttp);
const apiBase = process.env.host_name;

module.exports = function () {
  describe('pdf previews testcases', () => {
    let user1;
    let user2;
    let pdfResponse1;
    const randomUuid = uuidv4();

    before(done => {
      const registerUser = function () {
        return new Promise(resolve => {
          const username = faker.name.findName();
          const email = faker.internet.email();
          const password = 'User@123abc';

          chai
            .request(apiBase)
            .post('/api/register')
            .send({ username, email, password, roles: ['Author'] })
            .then(res => {
              return resolve(res.body.user);
            });
        });
      };

      const getUserToken = function () {
        return new Promise(resolve => {
          registerUser().then(user => {
            chai
              .request(apiBase)
              .post('/api/login')
              .send({ username: user.username, password: 'User@123abc' })
              .then(res => {
                return resolve(res.body.user);
              });
          });
        });
      };

      getUserToken().then(userData1 => {
        user1 = userData1;

        const title = faker.random.words(25);
        const pdf_url = faker.random.words(25);
        const author = faker.name.findName();
        const short_description = faker.random.words(60);
        const access_type = 'Private';

        chai
          .request(apiBase)
          .post('/api/pdf')
          .set('Authorization', `Bearer ${user1.token}`)
          .send({
            short_description,
            author,
            pdf_url,
            title,
            access_type
          })
          .then(pdfData1 => {
            pdfResponse1 = pdfData1.body.pdf;

            getUserToken().then(userData2 => {
              user2 = userData2;

              const title2 = faker.random.words(25);
              const pdf_url2 = faker.random.words(25);
              const author2 = faker.name.findName();
              const short_description2 = faker.random.words(60);
              const access_type2 = 'Private';

              chai
                .request(apiBase)
                .post('/api/pdf')
                .set('Authorization', `Bearer ${user2.token}`)
                .send({
                  short_description: short_description2,
                  author: author2,
                  pdf_url: pdf_url2,
                  title: title2,
                  access_type: access_type2
                })
                .then(() => {
                  return done();
                });
            });
          });
      });
    });

    it('fail: get with invalid pdf id', done => {
      chai
        .request(apiBase)
        .get(`/api/pdf/${randomUuid}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid pdfId');
          done();
        });
    });

    it('fail: get with unauthorized pdf id', done => {
      chai
        .request(apiBase)
        .get(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user2.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });

    it('fail: post with invalid pdf id', done => {
      chai
        .request(apiBase)
        .post(`/api/pdf/${randomUuid}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid pdfId');
          done();
        });
    });

    it('fail: post with unauthorized pdf id', done => {
      chai
        .request(apiBase)
        .post(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user2.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });

    it('fail: create previews with invalid value', done => {
      chai
        .request(apiBase)
        .post(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          previews: ['https://host.com/images1', 123]
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid preview');
          done();
        });
    });

    it('success: create previews for pdf', done => {
      chai
        .request(apiBase)
        .post(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          previews: ['https://host.com/images1']
        })
        .then(res => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('pdfPreviews');
          expect(res.body.pdfPreviews.length).to.equal(1);
          const preview = res.body.pdfPreviews[0];
          expect(preview).to.have.property('id');
          expect(preview).to.have.property('image_url').to.equal('https://host.com/images1');
          expect(preview).to.have.property('pdf');
          expect(Object.keys(preview.pdf)).to.eql([
            'id',
            'title',
            'pdf_url',
            'author',
            'short_description',
            'access_type',
            'user_id'
          ]);
          done();
        });
    });

    it('success: get pdf previews', done => {
      chai
        .request(apiBase)
        .get(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('pdfPreviews');
          if (res.body.pdfPreviews.length) {
            res.body.pdfPreviews.forEach(preview => {
              expect(preview).to.have.property('id');
              expect(preview).to.have.property('image_url');
              expect(preview).to.have.property('pdf');
              expect(Object.keys(preview.pdf)).to.eql([
                'id',
                'title',
                'pdf_url',
                'author',
                'short_description',
                'access_type',
                'user_id'
              ]);
            });
          }
          done();
        });
    });

    it('fail: again create preview for pdf', done => {
      chai
        .request(apiBase)
        .post(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          previews: ['https://host.com/images1']
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('previews already exists for this pdf');
          done();
        });
    });

    it('fail: patch with invalid pdf id', done => {
      chai
        .request(apiBase)
        .patch(`/api/pdf/${randomUuid}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid pdfId');
          done();
        });
    });

    it('fail: patch with unauthorized pdf id', done => {
      chai
        .request(apiBase)
        .patch(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user2.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });

    it('fail: update previews with invalid value', done => {
      chai
        .request(apiBase)
        .patch(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          previews: ['https://host.com/images1', 123]
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('previews must contain only string');
          done();
        });
    });

    it('success: update previews for pdf', done => {
      chai
        .request(apiBase)
        .patch(`/api/pdf/${pdfResponse1.id}/pdfPreview`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          previews: ['https://host.com/images2']
        })
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('pdfPreviews');
          expect(res.body.pdfPreviews.length).to.equal(1);
          const preview = res.body.pdfPreviews[0];
          expect(preview).to.have.property('id');
          expect(preview).to.have.property('image_url').to.equal('https://host.com/images2');
          expect(preview).to.have.property('pdf');
          expect(Object.keys(preview.pdf)).to.eql([
            'id',
            'title',
            'pdf_url',
            'author',
            'short_description',
            'access_type',
            'user_id'
          ]);
          done();
        });
    });
  });
};
