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
  describe('pdfCategories testcases', () => {
    let user1;
    let user2;
    let pdfResponse1;
    const randomUuid = uuidv4();
    const categories = ['Nonfiction', 'Fiction'];

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
        .get(`/api/pdf/${randomUuid}/pdfCategories`)
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
        .get(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
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
        .post(`/api/pdf/${randomUuid}/pdfCategories`)
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
        .post(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user2.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });

    it('fail: create categories with invalid value', done => {
      chai
        .request(apiBase)
        .post(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          categories: ['123']
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid category');
          done();
        });
    });

    it('success: create categories for pdf', done => {
      const categoryName = categories[0];
      chai
        .request(apiBase)
        .post(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          categories: [categoryName]
        })
        .then(res => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('pdfCategories');
          expect(res.body.pdfCategories.length).to.equal(1);
          res.body.pdfCategories.forEach(categoryObj => {
            expect(categoryObj).to.have.property('id');
            expect(categoryObj).to.have.property('category');
            expect(categoryObj.category).to.have.property('id');
            expect(categoryObj.category).to.have.property('name').to.equal(categoryName);
            expect(categoryObj).to.have.property('pdf');
            expect(Object.keys(categoryObj.pdf)).to.eql([
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

    it('success: gets pdf categories', done => {
      chai
        .request(apiBase)
        .get(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user1.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('pdfCategories');
          if (res.body.pdfCategories.length) {
            res.body.pdfCategories.forEach(categoryObj => {
              expect(categoryObj).to.have.property('id');
              expect(categoryObj).to.have.property('category');
              expect(categoryObj.category).to.have.property('id');
              expect(categoryObj.category).to.have.property('name');
              expect(categoryObj).to.have.property('pdf');
              expect(Object.keys(categoryObj.pdf)).to.eql([
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

    it('fail: again create categories for pdf', done => {
      const categoryName = categories[0];
      chai
        .request(apiBase)
        .post(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          categories: [categoryName]
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('categories already exists for this pdf');
          done();
        });
    });

    it('fail: patch with invalid pdf id', done => {
      chai
        .request(apiBase)
        .patch(`/api/pdf/${randomUuid}/pdfCategories`)
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
        .patch(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user2.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });

    it('fail: update categories with invalid value', done => {
      chai
        .request(apiBase)
        .patch(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          categories: [categories[0], '123']
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid category');
          done();
        });
    });

    it('success: update categories for pdf', done => {
      const categoryName = categories[1];
      chai
        .request(apiBase)
        .patch(`/api/pdf/${pdfResponse1.id}/pdfCategories`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          categories: [categoryName]
        })
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('pdfCategories');
          expect(res.body.pdfCategories.length).to.equal(1);
          res.body.pdfCategories.forEach(categoryObj => {
            expect(categoryObj).to.have.property('id');
            expect(categoryObj).to.have.property('category');
            expect(categoryObj.category).to.have.property('id');
            expect(categoryObj.category).to.have.property('name').to.equal(categoryName);
            expect(categoryObj).to.have.property('pdf');
            expect(Object.keys(categoryObj.pdf)).to.eql([
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
  });
};
