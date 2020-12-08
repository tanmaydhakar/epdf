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
  describe('categories testcases', () => {
    let adminToken;
    let categoriesResponse;
    const randomUuid = uuidv4();
    let categoryName = 'test1';

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
      it(`gets all the categories with query ${casesArr[i].query}`, done => {
        chai
          .request(apiBase)
          .get(`/api/categories/${casesArr[i].query}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('categories');
            expect(res.body).to.have.property('total');
            if (res.body.categories.length) {
              res.body.categories.forEach(category => {
                expect(category).to.have.property('id');
                expect(category).to.have.property('name');
              });
            }
            done();
          });
      });
    }

    it('success: adds a category', done => {
      chai
        .request(apiBase)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: categoryName
        })
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('categories');
          expect(res.body.categories).to.have.property('id');
          expect(res.body.categories).to.have.property('name').to.equal(categoryName);

          categoriesResponse = res.body.categories;
          done();
        });
    });

    it('fail: adds a category that already exists', done => {
      chai
        .request(apiBase)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: categoryName
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('category with this name already exists');
          done();
        });
    });

    it('fail: update a category with invalid id', done => {
      categoryName = 'test2';
      chai
        .request(apiBase)
        .patch(`/api/categories/${randomUuid}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: categoryName
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid categoryId');
          done();
        });
    });

    it('success: update a category', done => {
      chai
        .request(apiBase)
        .patch(`/api/categories/${categoriesResponse.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: categoryName
        })
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('categories');
          expect(res.body.categories).to.have.property('id');
          expect(res.body.categories).to.have.property('name').to.equal(categoryName);

          categoriesResponse = res.body.categories;
          done();
        });
    });

    it('fail: updates a category that already exists', done => {
      chai
        .request(apiBase)
        .patch(`/api/categories/${categoriesResponse.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: categoryName
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('category with this name already exists');
          done();
        });
    });

    it('fail: creates a category that already exists', done => {
      chai
        .request(apiBase)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: categoryName
        })
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('category with this name already exists');
          done();
        });
    });

    it('fail: deletes a category with invalid id', done => {
      chai
        .request(apiBase)
        .delete(`/api/categories/${randomUuid}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.statusCode).to.equal(422);
          expect(res.body).to.have.property('message');
          expect(res.body.message.msg).to.equal('invalid categoryId');
          done();
        });
    });

    it('success: deletes a category', done => {
      chai
        .request(apiBase)
        .delete(`/api/categories/${categoriesResponse.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .then(res => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('category has been deleted successfully');
          done();
        });
    });
  });
};
