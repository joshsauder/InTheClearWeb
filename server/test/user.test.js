process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
const user = require('../model/user');



describe('User', () => {
    describe("Test Add User", () =>{

        afterEach((done) => {
            user.findOneAndDelete({"name": "testUser"})
            .then(() => done())
        });

        it( 'Save new user', (done) =>{

            const testUser = {
                name: "testUser",
                username: "testUser",
                password: "test",
                email: "test@gmail.com"
            }
            chai.request(app)
            .post('/api/user')
            .send(testUser)
            .end((err, res) => {
                res.should.have.status(200)
                done();
            });
        });

        it('Save user without required', (done) => {
            const testUser = {
                name: "testUser",
                username: "testUser",
                email: "test@gmail.com"
            }
            chai.request(app)
            .post('/api/user')
            .send(testUser)
            .end((err, res) => {
                res.should.not.have.status(200)
                done();
            });
        });
    });

    describe("Test Auth User", () => {

        //create test user
        const testUser = {
            name: "testUser",
            username: "testUser",
            password: "test",
            email: "test@gmail.com"
        }

        before((done) => {
            user.create(testUser)
            .then(() => done())
        })

        after((done) => {
            user.findOneAndDelete({"name": "testUser"})
            .then(() => done())
        })

        it('Test auth with correct password', (done) => {
            const testSignInUser = {
                username: "testUser",
                password: "test"
            }

            chai.request(app)
            .post('/api/user/auth')
            .send(testSignInUser)
            .end((err, res) => {
                res.should.have.status(200)
                chai.expect(res.body).to.haveOwnProperty('api_KEY')
                chai.expect(res).to.have.cookie('token')
                done();
            })
        })

        it('Test auth with incorrect password', (done) => {

            const testSignInUser = {
                username: "testUser",
                password: "incorrect",
            }

            chai.request(app)
            .post('/api/user/auth')
            .send(testSignInUser)
            .end((err, res) => {
                res.should.not.have.status(200)
                done();
            })
        })
    })

   
});