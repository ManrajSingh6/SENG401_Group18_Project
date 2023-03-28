const request = require('supertest');// Making http requests in tests
const assert = require('assert'); //Making assertions in tests
const sinon = require('sinon');// Create mocks in tests
const nodemailer = require('nodemailer');
const app = require('../components/App'); // assuming the code is in a file named app.js

describe('Registration', function() {
  let stub;
  let transporter;

  before(function() {
    // mock nodemailer transporter for testing
    transporter = {
      sendMail: sinon.stub().callsFake(function(options, callback) {
        callback(null, {message: 'Email sent successfully'});
      })
    };
    stub = sinon.stub(nodemailer, 'createTransport').returns(transporter);
  });

  after(function() {
    // restore nodemailer transporter after testing
    stub.restore();
  });

  it('should send a confirmation email on successful registration', async function() {
    const response = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com'
      });
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.username, 'testuser');
    assert.strictEqual(response.body.email, 'testuser@example.com');
    assert(transporter.sendMail.calledOnceWith({
      from: 'seng401project@gmail.com',
      to: 'testuser@example.com',
      subject: 'The Loop: Account Registration Confirmation',
      text: 'A new user account has been created for The Loop with the following credentials:\nemail: testuser@example.com\nusername: testuser'
    }));
  });
});
