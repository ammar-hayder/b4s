var  supertest = require("supertest");
var  should = require('should');
// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe('GET /user', function() {

  it('should require authorization', function(done) {
      server
          .get('/user')
          .expect(401)
          .end(function(err, res) {
              if (err) return done(err);
              done();
          });
  });

  var auth = {token:""};
  before(loginUser(auth));

  it('should respond with JSON array', function(done) {
      server
          .get('/user/')
          .set('auth', auth.token)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
              if (err) return done(err);
              res.body.should.be.instanceof(Array);
              done();
          });
  });

});

function loginUser(auth) {
  return function(done) {
      server
          .post('/auth/login')
          .send({
              username: 'admin',
              password: 'admin'
          })
          .expect(200)
          .end(onResponse);

      function onResponse(err, res) {
          auth.token = res.body.token;
          return done();
      }
  };
}