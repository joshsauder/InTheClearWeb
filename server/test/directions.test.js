process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../index');


describe("Directions", function(){
    describe("Test Get directions", function(){

         /*
        Test route from Columbus to Indianapolis
        */
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

        /*
        Test Route from Columbus to Indianapolis
        */
        it("Test get city names", function(done){

            const resObj = {steps: steps, date: new Date()}
            chai.request(app)
            .post("/api/directions/info")
            .send(resObj)
            .end((err, res) => {
                res.should.have.status(200)
                chai.expect(res.body).to.haveOwnProperty("weather")
                chai.expect(res.body).to.haveOwnProperty("locations")
                done();
            })
        })
    })

    describe("Test Trip Times", function(){
        
        /*
        Test route with one stop
         */
        it("Test get trip times", function(done){

            const testLocations = [
                {lat: 39.9644, lng: -82.9959},
                {lat: 39.7797, lng: -86.1416},
                {lat: 41.8666, lng: -87.6372}
            ]
            
            chai.request(app)
            .post("/api/directions/tripTimes")
            .send(testLocations)
            .end((err, res) => {
                res.should.have.status(200)
                chai.expect(res.body).to.have.lengthOf(2)
                chai.expect(res.body[0]).to.haveOwnProperty("pos")
                chai.expect(res.body[0]).to.haveOwnProperty("time")
                done();
            })
        })

        /*
        Test route with only one location
        Should not return 200
        */
        it("Test Trip times with one locations", function(done){

            const testLocations = [
                {lat: 39.9644, lng: -82.9959}
            ]

            chai.request(app)
            .post("/api/directions/tripTimes")
            .send(testLocations)
            .end((err, res) => {
                res.should.not.have.status(200)
                done();
            })

        })
    })
})