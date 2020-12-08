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
  let adminToken;

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
    getUserToken().then(async userData => {
      adminToken = userData.token;

      const field = {
        name: 'Admin'
      };
      const role = await Role.findBySpecificField(field);
      const user = await User.findByPk(userData.id);
      const userRole = new UserRole();
      userRole.user_id = user.id;
      userRole.role_id = role.id;
      await userRole.save();
      done();
    });
  });

  const casesArr = [
    {
      query: '?page=0'
    },
    {
      query: '?page=1'
    },
    {
      query: '?sort=name'
    },
    {
      query: '?name=A'
    },
    {
      query: ''
    }
  ];

  for (let i = 0; i < casesArr.length; i += 1) {
    it(`gets all the roles with query ${casesArr[i].query}`, done => {
      chai
        .request(apiBase)
        .get(`/api/roles/${casesArr[i].query}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .then(res => {
          console.log(res.body);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('roles');
          expect(res.body).to.have.property('total');
          if (res.body.roles.length) {
            res.body.roles.forEach(role => {
              expect(role).to.have.property('id');
              expect(role).to.have.property('name');
            });
          }
          done();
        });
    });
  }
};
