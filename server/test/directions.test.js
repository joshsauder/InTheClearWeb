process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../index');


describe("Directions", function(){
    describe("Test Get directions", function(){

        it("Test get directions", (done) => {

            chai.request(app)
            .get("/api/directions/Columbus,OH/Indianapolis,IN")
            .end((err, res) => {
                res.should.have.status(200)
                chai.expect(res.body).to.haveOwnProperty("points")
                chai.expect(res.body).to.haveOwnProperty("steps")
                done();
            })
        })
    })

    describe("Test Get City Names and weather", function(){

        var steps = ""

        before((done) => {
            chai.request(app)
            .get("/api/directions/Columbus,OH/Indianapolis,IN")
            .end((err, res) => {
                steps = res.body.steps
                done()
            })
        })

        it("Test get city names", function(){

            const resObj = {steps: steps, date: new Date()}
            chai.request(app)
            .post("/api/directions/info")
            .send(resObj)
            .end((err, res) => {
                res.should.have.status(200)
                chai.expect(res.body).to.haveOwnProperty("weather")
                chai.expect(res.body).to.haveOwnProperty("locations")
            })
        })
    })

    describe("Test Trip Times", function(){
        
    })
})