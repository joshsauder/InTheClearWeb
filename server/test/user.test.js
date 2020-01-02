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
            user.findOneAndDelete({"email": "test@gmail.com"})
            .then(() => done())
        });

        /*
        Test create user
        Should return a 200
        */
        it( 'Save new user', (done) =>{

            //create test user
            const testUser = {
                name: {
                    firstName: "test",
                    lastName: "user"
                },
                email: "test@gmail.com",
                password: "test"
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
                name: {
                    firstName: "test",
                    lastName: "user"
                }             
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
            name: {
                firstName: "test",
                lastName: "user"
            },
            password: "test",
            email: "test@gmail.com",
            id: "12356"
        }

        before((done) => {
            user.create(testUser)
            .then(() => done())
        })

        after((done) => {
            user.findOneAndDelete({"email": "test@gmail.com"})
            .then(() => done())
        })

        /*
        Test auth when password is correct
        Should return a 200 and cookie
        */
        it('Test auth with correct password', (done) => {
            const testSignInUser = {
                email: "test@gmail.com",
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
                email: "testUser",
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

        it('Test Removal of Cookie', (done) => {

            const testSignInUser = {
                email: "test@gmail.com",
                password: "test"
            }

            chai.request(app)
            .post('/api/user/auth')
            .send(testSignInUser)
            .end((err, res) => {
                chai.request(app)
                .get('/app/user/auth/logout')
                .end((err, res) => {
                    res.should.have.status(200)
                    chai.expect(res).to.not.have.cookie('token')
                    done();
                })
            })
        })
    })

    describe('Test Password Hashing', () => {
         //create test user
        const testUser = {
            name: {
                firstName: "test",
                lastName: "user"
            },
            password: "test",
            email: "test@gmail.com",
            id: "1235"
        }

        after((done) => {
            user.findOneAndDelete({"email": "test@gmail.com"})
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