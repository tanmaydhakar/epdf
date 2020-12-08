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
  describe('userRoles testcases', () => {
    let adminData;
    let authorRole;
    let readerRole;
    let tempUser;
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
        adminData = userData;

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

    before(async () => {
      authorRole = await Role.findOne({
        where: {
          name: 'Author'
        }
      });

      readerRole = await Role.findOne({
        where: {
          name: 'Reader'
        }
      });

      return authorRole;
    });

    it('fail: invalid user id', done => {
      chai
        .request(apiBase)
        .post(`/api/user/${randomUuid}/userRole/${authorRole.id}`)
        .set('Authorization', `Bearer ${adminData.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid userId');
          done();
        });
    });

    it('fail: invalid role id', done => {
      chai
        .request(apiBase)
        .post(`/api/user/${adminData.id}/userRole/${randomUuid}`)
        .set('Authorization', `Bearer ${adminData.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid roleId');
          done();
        });
    });

    it('success: adds user role', done => {
      chai
        .request(apiBase)
        .post(`/api/user/${adminData.id}/userRole/${authorRole.id}`)
        .set('Authorization', `Bearer ${adminData.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property('userRole');
          expect(res.body.userRole).to.have.property('id');
          expect(res.body.userRole).to.have.property('user');
          expect(res.body.userRole.user).to.have.property('id').to.equal(adminData.id);
          expect(res.body.userRole).to.have.property('role');
          expect(res.body.userRole.role).to.have.property('name').to.equal(authorRole.name);
          done();
        });
    });

    it('fail: delete role with invalid user id', done => {
      chai
        .request(apiBase)
        .delete(`/api/user/${randomUuid}/userRole/${authorRole.id}`)
        .set('Authorization', `Bearer ${adminData.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid userId');
          done();
        });
    });

    it('fail: delete role with invalid role id', done => {
      chai
        .request(apiBase)
        .delete(`/api/user/${adminData.id}/userRole/${randomUuid}`)
        .set('Authorization', `Bearer ${adminData.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid roleId');
          done();
        });
    });

    it('fail: delete role with invalid role id', done => {
      chai
        .request(apiBase)
        .delete(`/api/user/${adminData.id}/userRole/${readerRole.id}`)
        .set('Authorization', `Bearer ${adminData.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('you cant delete this role');
          done();
        });
    });

    it('success: deletes a role', done => {
      chai
        .request(apiBase)
        .delete(`/api/user/${adminData.id}/userRole/${authorRole.id}`)
        .set('Authorization', `Bearer ${adminData.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('user role has been deleted successfully');
          done();
        });
    });

    before(done => {
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
        tempUser = userData;
        done();
      });
    });

    it('fail: add role with authorized access', done => {
      chai
        .request(apiBase)
        .post(`/api/user/${adminData.id}/userRole/${readerRole.id}`)
        .set('Authorization', `Bearer ${tempUser.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });

    it('fail: delete role with authorized access', done => {
      chai
        .request(apiBase)
        .delete(`/api/user/${adminData.id}/userRole/${readerRole.id}`)
        .set('Authorization', `Bearer ${tempUser.token}`)
        .then(res => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('user is unauthorized to access this resource');
          done();
        });
    });
  });
};
