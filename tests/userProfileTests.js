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
  describe('userProfile testcases', () => {
    let user1;
    let userToken1;
    let userToken2;
    const randomUuid = uuidv4();
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const phone = faker.phone.phoneNumberFormat();
    const city = faker.address.city();
    const state = faker.address.state();

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
          registerUser().then(userData => {
            chai
              .request(apiBase)
              .post('/api/login')
              .send({ username: userData.username, password: 'User@123abc' })
              .then(res => {
                return resolve(res.body.user);
              });
          });
        });
      };
      getUserToken().then(userData1 => {
        user1 = userData1;
        userToken1 = userData1.token;
        getUserToken().then(userData2 => {
          userToken2 = userData2.token;
          return done();
        });
      });
    });

    it('fail: access unauthorized profile', done => {
      chai
        .request(apiBase)
        .patch(`/api/user/${user1.id}/userProfile`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send({ first_name, last_name, phone, city, state })
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });

    const cases = [
      {
        description: 'user id does not exists',
        msg: 'invalid userId',
        data: { first_name, last_name, phone, city, state },
        userId: randomUuid
      },
      {
        description: 'first name not exists',
        msg: 'first_name does not exists',
        data: { last_name, phone, city, state }
      },
      {
        description: 'first name not string',
        msg: 'first_name must be string',
        data: { first_name: 123, last_name, phone, city, state }
      },
      {
        description: 'first name empty',
        msg: 'first_name should be minimum 1 characters',
        data: { first_name: '', last_name, phone, city, state }
      },
      {
        description: 'last name not exists',
        msg: 'last_name does not exists',
        data: { first_name, phone, city, state }
      },
      {
        description: 'last name not string',
        msg: 'last_name must be string',
        data: { last_name: 123, first_name, phone, city, state }
      },
      {
        description: 'last name empty',
        msg: 'last_name should be minimum 1 characters',
        data: { last_name: '', first_name, phone, city, state }
      },
      {
        description: 'phone not exists',
        msg: 'phone does not exists',
        data: { first_name, last_name, city, state }
      },
      {
        description: 'phone not string',
        msg: 'phone must be string',
        data: { first_name, last_name, city, state, phone: 123 }
      },
      {
        description: 'phone not 10-13 characters',
        msg: 'phone should be minimum 10 and a maximum of 13 characters',
        data: { first_name, last_name, city, state, phone: '1234567' }
      },
      {
        description: 'city not exists',
        msg: 'city does not exists',
        data: { first_name, last_name, state, phone }
      },
      {
        description: 'city not string',
        msg: 'city must be string',
        data: { first_name, last_name, state, phone, city: 123 }
      },
      {
        description: 'city not min 2 characters',
        msg: 'city should be minimum 2 characters',
        data: { first_name, last_name, state, phone, city: 'a' }
      },
      {
        description: 'state not exists',
        msg: 'state does not exists',
        data: { first_name, last_name, city, phone }
      },
      {
        description: 'state not string',
        msg: 'state must be string',
        data: { first_name, last_name, city, phone, state: 123 }
      },
      {
        description: 'state not min 2 characters',
        msg: 'state should be minimum 2 characters',
        data: { first_name, last_name, city, phone, state: 'a' }
      }
    ];

    for (let i = 0; i < cases.length; i += 1) {
      it(cases[i].description, done => {
        const userId = cases[i].userId ? cases[i].userId : user1.id;
        chai
          .request(apiBase)
          .patch(`/api/user/${userId}/userProfile`)
          .set('Authorization', `Bearer ${userToken1}`)
          .send(cases[i].data)
          .then(res => {
            expect(res.statusCode).to.equal(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal(cases[i].msg);
            done();
          });
      });
    }

    it('success: updates user profile', done => {
      chai
        .request(apiBase)
        .patch(`/api/user/${user1.id}/userProfile`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send({ first_name, last_name, phone, city, state })
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('userProfile');
          expect(res.body.userProfile).to.have.property('id');
          expect(res.body.userProfile).to.have.property('first_name').to.equal(first_name);
          expect(res.body.userProfile).to.have.property('last_name').to.equal(last_name);
          expect(res.body.userProfile)
            .to.have.property('full_name')
            .to.equal(`${first_name} ${last_name}`);
          expect(res.body.userProfile).to.have.property('phone').to.equal(phone);
          expect(res.body.userProfile).to.have.property('city').to.equal(city);
          expect(res.body.userProfile).to.have.property('state').to.equal(state);
          expect(res.body.userProfile).to.have.property('user');

          done();
        });
    });

    describe('fail show profile', () => {
      it('fail: invalid userId', done => {
        chai
          .request(apiBase)
          .get(`/api/user/${randomUuid}/userProfile`)
          .set('Authorization', `Bearer ${userToken1}`)
          .then(res => {
            expect(res.statusCode).to.equal(422);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('invalid userId');
            done();
          });
      });

      it('fail: get unauthorized profile', done => {
        chai
          .request(apiBase)
          .get(`/api/user/${user1.id}/userProfile`)
          .set('Authorization', `Bearer ${userToken2}`)
          .then(res => {
            expect(res.statusCode).to.equal(403);
            expect(res.body).to.have.property('message');
            expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
            done();
          });
      });
    });

    it('success: show profile', done => {
      chai
        .request(apiBase)
        .get(`/api/user/${user1.id}/userProfile`)
        .set('Authorization', `Bearer ${userToken1}`)
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('userProfile');
          expect(res.body.userProfile).to.have.property('id');
          expect(res.body.userProfile).to.have.property('first_name').to.equal(first_name);
          expect(res.body.userProfile).to.have.property('last_name').to.equal(last_name);
          expect(res.body.userProfile)
            .to.have.property('full_name')
            .to.equal(`${first_name} ${last_name}`);
          expect(res.body.userProfile).to.have.property('phone').to.equal(phone);
          expect(res.body.userProfile).to.have.property('city').to.equal(city);
          expect(res.body.userProfile).to.have.property('state').to.equal(state);
          expect(res.body.userProfile).to.have.property('user');

          done();
        });
    });
  });
};
