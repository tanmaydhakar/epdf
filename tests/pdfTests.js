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
const db = require(path.resolve('./models'));
const { User, Role, UserRole } = db;

chai.use(chaiHttp);
const apiBase = process.env.host_name;

module.exports = function () {
  describe('Pdf testcases', () => {
    let userToken;
    let pdfResponse;
    const title = faker.random.words(25);
    const pdf_url = faker.random.words(25);
    const author = faker.name.findName();
    const short_description = faker.random.words(60);
    const access_type = 'Private';
    const categories = ['Nonfiction', 'Fiction'];
    const previews = ['https://host.com/images1'];

    before(function (done) {
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
      getUserToken().then(user => {
        userToken = user.token;
        done();
      });
    });

    describe('create pdf cases', () => {
      const cases = [
        {
          description: 'Fail: title does not exists',
          msg: 'title does not exists',
          data: {
            pdf_url,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: title not string',
          msg: 'title must be string',
          data: {
            title: 123,
            pdf_url,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: title not 5 character',
          msg: 'title should be minimum 5 characters',
          data: {
            title: '123',
            pdf_url,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: pdf_url not exists',
          msg: 'pdf_url does not exists',
          data: {
            title,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: pdf_url not string',
          msg: 'pdf_url must be string',
          data: {
            pdf_url: 123,
            title,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: author not exists',
          msg: 'author does not exists',
          data: {
            pdf_url,
            title,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: author not string',
          msg: 'author must be string',
          data: {
            author: 131,
            pdf_url,
            title,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: author not 1 character',
          msg: 'author should be minimum 1 characters',
          data: {
            author: '',
            pdf_url,
            title,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: short_description not exists',
          msg: 'short_description does not exists',
          data: {
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: short_description not string',
          msg: 'short_description must be string',
          data: {
            short_description: 123,
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: short_description not 50 character',
          msg: 'short_description should be minimum 50 characters',
          data: {
            short_description: 'J. K. Rowling',
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: access_type not exists',
          msg: 'access_type does not exists',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            categories,
            previews
          }
        },
        {
          description: 'Fail: access_type not string',
          msg: 'access_type must be string',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type: 123,
            categories,
            previews
          }
        },
        {
          description: 'Fail: invalid access_type',
          msg: 'invalid access_type',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type: 'test',
            categories,
            previews
          }
        },
        {
          description: 'Fail: without categories',
          msg: 'categories does not exists',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            previews
          }
        },
        {
          description: 'Fail: categories not array',
          msg: 'categories must be array',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories: 'test',
            previews
          }
        },
        {
          description: 'Fail: invalid category',
          msg: 'invalid category',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories: ['test'],
            previews
          }
        },
        {
          description: 'Fail: without preview',
          msg: 'previews does not exists',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories
          }
        },
        {
          description: 'Fail: not array preview',
          msg: 'previews must be array',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews: 'test'
          }
        },
        {
          description: 'Fail: not string preview',
          msg: 'previews must contain only string',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews: [123]
          }
        }
      ];

      for (let i = 0; i < cases.length; i += 1) {
        it(cases[i].description, done => {
          chai
            .request(apiBase)
            .post('/api/pdf')
            .set('Authorization', `Bearer ${userToken}`)
            .send(cases[i].data)
            .then(res => {
              expect(res.statusCode).to.equal(422);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal(cases[i].msg);
              done();
            });
        });
      }

      it('success: create pdf', done => {
        chai
          .request(apiBase)
          .post('/api/pdf')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          })
          .then(res => {
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.have.property('pdf');
            expect(res.body.pdf).to.have.property('id');
            expect(res.body.pdf).to.have.property('previews');
            expect(res.body.pdf).to.have.property('categories');
            expect(res.body.pdf).to.have.property('user');
            expect(res.body.pdf).to.have.property('title').to.equal(title);
            expect(res.body.pdf).to.have.property('access_type').to.equal(access_type);
            expect(res.body.pdf).to.have.property('short_description').to.equal(short_description);
            expect(res.body.pdf).to.have.property('author').to.equal(author);
            expect(res.body.pdf).to.have.property('pdf_url').to.equal(pdf_url);

            pdfResponse = res.body.pdf;
            done();
          });
      });

      const cases2 = [
        {
          description: 'Fail: create with taken title',
          msg: 'title already exists',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: create with taken pdf_url',
          msg: 'pdf_url already exists',
          data: {
            short_description,
            author,
            pdf_url,
            title: title + 1,
            access_type,
            categories,
            previews
          }
        }
      ];

      for (let i = 0; i < cases2.length; i += 1) {
        it(cases2[i].description, done => {
          chai
            .request(apiBase)
            .post('/api/pdf')
            .set('Authorization', `Bearer ${userToken}`)
            .send(cases2[i].data)
            .then(res => {
              expect(res.statusCode).to.equal(422);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal(cases2[i].msg);
              done();
            });
        });
      }
    });

    describe('update pdf test cases', () => {
      const cases = [
        {
          pdfId: uuidv4(),
          description: 'Fail: invalid pdfId',
          msg: 'invalid pdfId',
          data: {
            title,
            pdf_url,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: title does not exists',
          msg: 'title does not exists',
          data: {
            pdf_url,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: title not string',
          msg: 'title must be string',
          data: {
            title: 123,
            pdf_url,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: title not 5 character',
          msg: 'title should be minimum 5 characters',
          data: {
            title: '123',
            pdf_url,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: pdf_url not exists',
          msg: 'pdf_url does not exists',
          data: {
            title,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: pdf_url not string',
          msg: 'pdf_url must be string',
          data: {
            pdf_url: 123,
            title,
            author,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: author not exists',
          msg: 'author does not exists',
          data: {
            pdf_url,
            title,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: author not string',
          msg: 'author must be string',
          data: {
            author: 131,
            pdf_url,
            title,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: author not 1 character',
          msg: 'author should be minimum 1 characters',
          data: {
            author: '',
            pdf_url,
            title,
            short_description,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: short_description not exists',
          msg: 'short_description does not exists',
          data: {
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: short_description not string',
          msg: 'short_description must be string',
          data: {
            short_description: 123,
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: short_description not 50 character',
          msg: 'short_description should be minimum 50 characters',
          data: {
            short_description: 'J. K. Rowling',
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews
          }
        },
        {
          description: 'Fail: access_type not exists',
          msg: 'access_type does not exists',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            categories,
            previews
          }
        },
        {
          description: 'Fail: access_type not string',
          msg: 'access_type must be string',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type: 123,
            categories,
            previews
          }
        },
        {
          description: 'Fail: invalid access_type',
          msg: 'invalid access_type',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type: 'test',
            categories,
            previews
          }
        },
        {
          description: 'Fail: not string preview',
          msg: 'previews must contain only string',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories,
            previews: [123]
          }
        },
        {
          description: 'Fail: invalid category',
          msg: 'invalid category',
          data: {
            short_description,
            author,
            pdf_url,
            title,
            access_type,
            categories: ['test'],
            previews
          }
        }
      ];

      for (let i = 0; i < cases.length; i += 1) {
        it(cases[i].description, done => {
          const pdfid = cases[i].pdfId ? cases[i].pdfId : pdfResponse.id;
          chai
            .request(apiBase)
            .patch(`/api/pdf/${pdfid}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(cases[i].data)
            .then(res => {
              expect(res.statusCode).to.equal(422);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal(cases[i].msg);
              done();
            });
        });
      }

      describe('checks already exists cases', () => {
        let userToken2;
        const title2 = faker.random.words(25);
        const pdf_url2 = faker.random.words(25);
        const author2 = faker.name.findName();
        const short_description2 = faker.random.words(60);
        const access_type2 = 'Private';
        const previews2 = ['https://host.com/images2'];
        const categories2 = ['Philosophy'];

        before(function (done) {
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
          getUserToken().then(user => {
            userToken2 = user.token;
            chai
              .request(apiBase)
              .post('/api/pdf')
              .set('Authorization', `Bearer ${userToken2}`)
              .send({
                short_description: short_description2,
                author: author2,
                pdf_url: pdf_url2,
                title: title2,
                access_type: access_type2,
                previews: previews2,
                categories: categories2
              })
              .then(() => {
                return done();
              });
          });
        });

        it('fail: title already exists', done => {
          chai
            .request(apiBase)
            .patch(`/api/pdf/${pdfResponse.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              short_description,
              author,
              pdf_url,
              title: title2,
              access_type,
              previews,
              categories
            })
            .then(res => {
              expect(res.statusCode).to.equal(422);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal('title already exists');
              done();
            });
        });

        it('fail: pdf_url already exists', done => {
          chai
            .request(apiBase)
            .patch(`/api/pdf/${pdfResponse.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ short_description, author, pdf_url: pdf_url2, title, access_type })
            .then(res => {
              expect(res.statusCode).to.equal(422);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal('pdf_url already exists');
              done();
            });
        });

        it('fail: access unauthorized pdf', done => {
          chai
            .request(apiBase)
            .patch(`/api/pdf/${pdfResponse.id}`)
            .set('Authorization', `Bearer ${userToken2}`)
            .send({ short_description, author, pdf_url, title, access_type })
            .then(res => {
              expect(res.statusCode).to.equal(403);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
              done();
            });
        });
      });

      it('success: update pdf', done => {
        const updatedPdfUrl = faker.random.words(25);
        chai
          .request(apiBase)
          .patch(`/api/pdf/${pdfResponse.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            short_description,
            author,
            pdf_url: updatedPdfUrl,
            title,
            access_type,
            previews: ['https://host.com/images2'],
            categories
          })
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('pdf');
            expect(res.body.pdf).to.have.property('id');
            expect(res.body.pdf).to.have.property('previews');
            expect(res.body.pdf).to.have.property('categories');
            expect(res.body.pdf).to.have.property('user');
            expect(res.body.pdf).to.have.property('title').to.equal(title);
            expect(res.body.pdf).to.have.property('access_type').to.equal(access_type);
            expect(res.body.pdf).to.have.property('short_description').to.equal(short_description);
            expect(res.body.pdf).to.have.property('author').to.equal(author);
            expect(res.body.pdf).to.have.property('pdf_url').to.equal(updatedPdfUrl);

            done();
          });
      });
    });

    describe('get pdf cases', () => {
      let userToken2;
      const randomUuid = uuidv4();

      before(function (done) {
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
        getUserToken().then(user => {
          userToken2 = user.token;
          return done();
        });
      });

      it('fail: gets invalid pdfId', done => {
        chai
          .request(apiBase)
          .get(`/api/pdf/${randomUuid}`)
          .set('Authorization', `Bearer ${userToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('invalid pdfId');
            done();
          });
      });

      it('fail: gets unauthorized pdfId', done => {
        chai
          .request(apiBase)
          .get(`/api/pdf/${pdfResponse.id}`)
          .set('Authorization', `Bearer ${userToken2}`)
          .then(res => {
            expect(res.statusCode).to.equal(403);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
            done();
          });
      });

      before(done => {
        chai
          .request(apiBase)
          .patch(`/api/pdf/${pdfResponse.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ short_description, author, pdf_url, title, access_type, previews, categories })
          .then(() => {
            done();
          });
      });

      it('success: gets a pdfId', done => {
        chai
          .request(apiBase)
          .get(`/api/pdf/${pdfResponse.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('pdf');
            expect(res.body.pdf).to.have.property('id');
            expect(res.body.pdf).to.have.property('previews');
            expect(res.body.pdf).to.have.property('categories');
            expect(res.body.pdf).to.have.property('user');
            expect(res.body.pdf).to.have.property('title').to.equal(title);
            expect(res.body.pdf).to.have.property('access_type').to.equal(access_type);
            expect(res.body.pdf).to.have.property('short_description').to.equal(short_description);
            expect(res.body.pdf).to.have.property('author').to.equal(author);
            expect(res.body.pdf).to.have.property('pdf_url').to.equal(pdf_url);

            done();
          });
      });
    });

    describe('index pdfs', () => {
      const cases = [
        {
          query: '?title=A'
        },
        {
          query: '?author=A'
        },
        {
          query: '?sort=author'
        },
        {
          query: '?sort=title'
        },
        {
          query: ''
        },
        {
          query: '?page=1'
        }
      ];
      for (let i = 0; i < cases.length; i += 1) {
        it(`success: gets all pdfs where ${cases[i].query}`, done => {
          chai
            .request(apiBase)
            .get(`/api/pdfs${cases[i].query}`)
            .set('Authorization', `Bearer ${userToken}`)
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('pdfs');
              if (res.body.pdfs.length) {
                res.body.pdfs.forEach(pdf => {
                  expect(pdf).to.have.property('id');
                  expect(pdf).to.have.property('previews');
                  expect(pdf).to.have.property('categories');
                  expect(pdf).to.have.property('user');
                  expect(pdf).to.have.property('title');
                  expect(pdf).to.have.property('access_type');
                  expect(pdf).to.have.property('short_description');
                  expect(pdf).to.have.property('author');
                  expect(pdf).to.have.property('pdf_url');
                });
              }

              done();
            });
        });
      }
    });

    describe('destroy pdfs', () => {
      let userToken2;
      let pdfResponse2;
      const randomUuid = uuidv4();
      const title2 = faker.random.words(25);
      const pdf_url2 = faker.random.words(25);
      const author2 = faker.name.findName();
      const short_description2 = faker.random.words(60);
      const access_type2 = 'Private';
      const previews2 = ['https://host.com/images2'];
      const categories2 = ['Philosophy'];

      it('fail: deletes invalid pdf', done => {
        chai
          .request(apiBase)
          .delete(`/api/pdf/${randomUuid}`)
          .set('Authorization', `Bearer ${userToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('invalid pdfId');
            done();
          });
      });

      before(function (done) {
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
        getUserToken().then(user => {
          userToken2 = user.token;
          chai
            .request(apiBase)
            .post('/api/pdf')
            .set('Authorization', `Bearer ${userToken2}`)
            .send({
              short_description: short_description2,
              author: author2,
              pdf_url: pdf_url2,
              title: title2,
              access_type: access_type2,
              previews: previews2,
              categories: categories2
            })
            .then(res => {
              pdfResponse2 = res.body.pdf;
              return done();
            });
        });
      });

      it('fail: deletes unauthorized pdf', done => {
        chai
          .request(apiBase)
          .delete(`/api/pdf/${pdfResponse2.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(403);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
            done();
          });
      });

      it('success: deletes a pdf', done => {
        chai
          .request(apiBase)
          .delete(`/api/pdf/${pdfResponse2.id}`)
          .set('Authorization', `Bearer ${userToken2}`)
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.equal('Pdf has been deleted successfully');
            done();
          });
      });
    });

    describe('index all pdfs for admin', () => {
      let adminToken;
      let userResponse;
      let roleId;

      before(function (done) {
        const registerUser = function () {
          return new Promise(resolve => {
            const username = faker.name.findName();
            const email = faker.internet.email();
            const password = 'User@123abc';

            chai
              .request(apiBase)
              .post('/api/register')
              .send({ username, email, password })
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
        getUserToken().then(async userData => {
          userResponse = userData;
          adminToken = userData.token;

          const field = {
            name: 'Admin'
          };
          const role = await Role.findBySpecificField(field);
          roleId = role.id;
          const user = await User.findByPk(userData.id);
          const userRole = new UserRole();
          userRole.user_id = user.id;
          userRole.role_id = role.id;
          await userRole.save();
          done();
        });
      });
      it('gets all pdfs using admin token', done => {
        chai
          .request(apiBase)
          .get(`/api/pdfs`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('pdfs');
            if (res.body.pdfs.length) {
              res.body.pdfs.forEach(pdf => {
                expect(pdf).to.have.property('id');
                expect(pdf).to.have.property('previews');
                expect(pdf).to.have.property('categories');
                expect(pdf).to.have.property('user');
                expect(pdf).to.have.property('title');
                expect(pdf).to.have.property('access_type');
                expect(pdf).to.have.property('short_description');
                expect(pdf).to.have.property('author');
                expect(pdf).to.have.property('pdf_url');
              });
            }

            done();
          });
      });

      const cases = [
        {
          query: `?category=${categories[0]}`
        },
        {
          query: `?author=${author}`
        }
      ];

      for (let i = 0; i < cases.length; i += 1) {
        it(`gets all pdf counts with query ${cases[i].query}`, done => {
          chai
            .request(apiBase)
            .get(`/api/pdf-count${cases[i].query}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .then(res => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.have.property('count');

              done();
            });
        });
      }

      it('gets all pdf count by a user using user id', done => {
        chai
          .request(apiBase)
          .get(`/api/pdf-count?userId=${userResponse.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('count');

            done();
          });
      });

      it('gets all pdf count by a user using role id', done => {
        chai
          .request(apiBase)
          .get(`/api/pdf-count?roleId=${roleId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('count');

            done();
          });
      });
    });
  });
};
