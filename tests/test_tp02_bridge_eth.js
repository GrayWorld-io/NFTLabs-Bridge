const request = require("supertest");
const should = require("should");
const {Transaction, PrivateKey} = require("@hashgraph/sdk")

const constant = require("./test_constant");

const point = require("../app");

describe("bridge all", function() {
  this.timeout(6000);

  before( (done) => {
    
    done();
  })

  describe("POST /bridge/getMessage", function() {
    it("[bridge] should get bridge Lock transaction correctly", function(done) {
      request(point)
        .post("/bridge/getMessage")
        .type("json")
        .send(JSON.stringify(constant.getEthMintMessage()))
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          console.log(res.body.result)
          res.body.result.code.code.should.equal(1);
          done();
        });
    });
  });

  describe("POST /bridge/getMintTx", function() {
    it("[bridge] should get bridge mint transaction correctly", function(done) {
      request(point)
        .post("/bridge/getMintTx")
        .type("json")
        .send(JSON.stringify(constant.getEthMintTx()))
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          console.log(res.body.result)
          res.body.result.code.code.should.equal(1);
          done();
        });
    });
  });
});
