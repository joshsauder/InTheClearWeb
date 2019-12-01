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

        /*
        Test create user
        Should return a 200
        */
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

        /*
        Test create user without password
        Should not return a 200 
        */
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

        /*
        Test auth when password is correct
        Should return a 200 and cookie
        */
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

        /*
        Test auth when password is incorrect
        Should not return a 200 and cookie
        */
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
                chai.expect(res).to.not.have.cookie('token')
                done();
            })
        })
    })

    describe("Test Update User", () => {

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

        /*
        Test update username
        */
        it('Test update user password', (done) => {

            const updatedTestUser = {
                name: "testUser",
                username: "testUser",
                password: "test3",
                email: "test@gmail.com"
            }
            
            chai.request(app)
            .put('/api/user/testUser')
            .send(updatedTestUser)
            .end((err, res) => {
                res.should.have.status(200)
                done();
            })
        })
 
        /*
        Test update username since username is given a request param
        */
        it('Test Update Username', (done) => {
            const updatedTestUser = {
                name: "testUser",
                username: "testUsers",
                password: "test3",
                email: "test@gmail.com"
            }

            chai.request(app)
            .put('/api/user/testUser')
            .send(updatedTestUser)
            .end((err, res) => {
                res.should.have.status(200)
                done();
            })
        })

    })

    describe('Test Password Hashing', () => {
         //create test user
         const testUser = {
            name: "testUser",
            username: "testUser",
            password: "test",
            email: "test@gmail.com"
        }

        after((done) => {
            user.findOneAndDelete({"name": "testUser"})
            .then(() => done())
        })

        /*
        Need to check that password is being hashed on save
        */
        it('Test password is hashed', (done) => {
            const newUser = user(testUser);
            newUser.save((err) => {
                chai.expect(newUser.password).to.not.equal(testUser.password)
                done()
            })
        })
    })
});