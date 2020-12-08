/* eslint-disable camelcase */
/* eslint-disable no-loop-func */
const chai = require('chai');
const faker = require('faker');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const { describe } = require('mocha');
const { v4: uuidv4 } = require('uuid');

const categories = ['Nonfiction', 'Fiction'];

require(path.resolve('./index'));
const db = require(path.resolve('./models'));
const { User, Role, UserRole } = db;

chai.use(chaiHttp);
const apiBase = process.env.host_name;

module.exports = function () {
  describe('User testcases', () => {
    const username = faker.name.findName();
    const email = faker.internet.email();
    const password = 'User@123abc';
    const randomUuid = uuidv4();

    describe('Register user cases', () => {
      const cases = [
        {
          description: 'Fail: registers a user without username',
          msg: 'username does not exists',
          data: { password, email }
        },
        {
          description: 'Fail: registers a user without email',
          msg: 'email does not exists',
          data: { password, username }
        },
        {
          description: 'Fail: registers a user without password',
          msg: 'password does not exists',
          data: { email, username }
        },
        {
          description: 'Fail: registers a user with non string password',
          msg: 'password must be string',
          data: { email, username, password: 123 }
        },
        {
          description: 'Fail: registers a user with non 6 character password',
          msg: 'password should be minimum 6 characters',
          data: { email, username, password: 'abc1' }
        },
        {
          description: 'Fail: registers a user without small case in password',
          msg: 'Password should contain atleast one capital letter',
          data: { email, username, password: 'onlylowercase' }
        },
        {
          description: 'Fail: registers a user without upper case in password',
          msg: 'Password should contain atleast one small letter',
          data: { email, username, password: 'ONLYUPPERCASE' }
        },
        {
          description: 'Fail: registers a user without special charater in password',
          msg: 'Password should contain atleast one special character',
          data: { email, username, password: 'Abc123abc' }
        },
        {
          description: 'Fail: registers a user with invalid email',
          msg: 'Invalid email format',
          data: { password, email: username, username }
        },
        {
          description: 'Fail: registers a user without string username',
          msg: 'username must be string',
          data: { username: 123, password, email }
        },
        {
          description: 'Fail: registers a user with less than 5 letter username',
          msg: 'username should be minimum 5 characters',
          data: { username: 'abcd', password, email }
        },
        {
          description: 'Fail: registers a user with roles type non array',
          msg: 'roles must be type array',
          data: { username, password, email, roles: 'ok' }
        },
        {
          description: 'Fail: registers a user with roles type admin',
          msg: 'role is invalid',
          data: { username, password, email, roles: ['Admin'] }
        }
      ];

      for (let i = 0; i < cases.length; i += 1) {
        it(cases[i].description, done => {
          chai
            .request(apiBase)
            .post('/api/register')
            .send(cases[i].data)
            .then(res => {
              expect(res.statusCode).to.equal(422);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal(cases[i].msg);
              done();
            });
        });
      }

      it('registers a user successfully', done => {
        chai
          .request(apiBase)
          .post('/api/register')
          .send({ username, password, email, roles: ['Reader'] })
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('user');
            expect(res.body.user.username).to.equal(username);
            expect(res.body.user.email).to.equal(email);
            done();
          });
      });

      const cases2 = [
        {
          description: 'Fail: registers a user with taken username',
          msg: 'username already exists',
          data: { username, password, email }
        },
        {
          description: 'Fail: registers a user with taken email',
          msg: 'Email already exists',
          data: { username: username + 1, password, email }
        }
      ];

      for (let i = 0; i < cases2.length; i += 1) {
        it(cases2[i].description, done => {
          chai
            .request(apiBase)
            .post('/api/register')
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

    describe('Login user cases', () => {
      const cases = [
        {
          description: 'Fail: log in a user without username',
          msg: 'username does not exists',
          data: { password }
        },
        {
          description: 'Fail: log in a user without password',
          msg: 'password does not exists',
          data: { username }
        },
        {
          description: 'Fail: log in a user with empty password',
          msg: 'password should not be empty',
          data: { password: '', username }
        },
        {
          description: 'Fail: log in a user with invalid username',
          msg: 'username is invalid',
          data: { username: username + 1, password }
        }
      ];

      for (let i = 0; i < cases.length; i += 1) {
        it(cases[i].description, done => {
          chai
            .request(apiBase)
            .post('/api/login')
            .send(cases[i].data)
            .then(res => {
              expect(res.statusCode).to.equal(422);
              expect(res.body).to.have.property('message');
              expect(res.body.message.msg).to.equal(cases[i].msg);
              done();
            });
        });
      }

      it('Fail: log in a user with invalid password', done => {
        chai
          .request(apiBase)
          .post('/api/login')
          .send({ username, password: password + 1 })
          .then(res => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Invalid username or password');
            done();
          });
      });

      it('logs in a user successfully', done => {
        chai
          .request(apiBase)
          .post('/api/login')
          .send({ username, password })
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.have.property('id');
            expect(res.body.user.username).to.equal(username);
            expect(res.body.user.email).to.equal(email);
            expect(res.body.user).to.have.property('token');
            done();
          });
      });
    });

    describe('delete user', () => {
      let userData;
      let userData2;
      let adminToken;
      before(function (done) {
        const registerUser = function () {
          return new Promise(resolve => {
            const tempUser = {
              username: faker.name.findName(),
              email: faker.internet.email(),
              password: 'User@123abc',
              roles: ['Author']
            };
            chai
              .request(apiBase)
              .post('/api/register')
              .send(tempUser)
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
        getUserToken().then(async userResponse1 => {
          userData = userResponse1;
          const title = faker.random.words(25);
          const pdf_url = faker.random.words(25);
          const author = faker.name.findName();
          const short_description = faker.random.words(60);
          const access_type = 'Private';

          chai
            .request(apiBase)
            .post('/api/pdf')
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              short_description,
              author,
              pdf_url,
              title,
              access_type
            })
            .then(pdfResponse1 => {
              chai
                .request(apiBase)
                .post(`/api/pdf/${pdfResponse1.body.pdf.id}/pdfPreview`)
                .set('Authorization', `Bearer ${userData.token}`)
                .send({
                  previews: ['https://host.com/images1']
                })
                .then(() => {
                  chai
                    .request(apiBase)
                    .post(`/api/pdf/${pdfResponse1.body.pdf.id}/pdfCategories`)
                    .set('Authorization', `Bearer ${userData.token}`)
                    .send({
                      categories: [categories[0]]
                    })
                    .then(() => {
                      getUserToken().then(async userResponse2 => {
                        adminToken = userResponse2.token;
                        const field = {
                          name: 'Admin'
                        };
                        const role = await Role.findBySpecificField(field);
                        const user = await User.findByPk(userResponse2.id);
                        const userRole = new UserRole();
                        userRole.user_id = user.id;
                        userRole.role_id = role.id;
                        await userRole.save();

                        getUserToken().then(async userResponse3 => {
                          userData2 = userResponse3;
                          const user2 = await User.findByPk(userResponse3.id);
                          const userRole2 = new UserRole();
                          userRole2.user_id = user2.id;
                          userRole2.role_id = role.id;
                          await userRole2.save();
                          done();
                        });
                      });
                    });
                });
            });
        });
      });

      it('success: delete user', done => {
        chai
          .request(apiBase)
          .delete(`/api/user/${userData.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('status');
            expect(res.body.status).to.equal('user has been deleted successfully');
            done();
          });
      });

      it('fail: delete user with invalid userId', done => {
        chai
          .request(apiBase)
          .delete(`/api/user/${randomUuid}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('userId is invalid');
            done();
          });
      });

      it('fail: delete an admin', done => {
        console.log('erokoer');
        chai
          .request(apiBase)
          .delete(`/api/user/${userData2.id}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('admin can not be deleted');
            done();
          });
      });
    });
  });
};
