const request = require("supertest");
const should = require("should");

const constant = require("./test_constant");

const point = require("../app");

let tx = '';

describe("my all", function() {
  this.timeout(6000);

  before( (done) => {
    
    done();
  })

  describe("POST /my/nft", function() {
    it("[bridge] should get my nft list correctly", function(done) {
      request(point)
        .post("/my/nft")
        .type("json")
        .send(JSON.stringify(constant.getBridgeHederaLock()))
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          tx = res.body.result.tx;
          res.body.result.code.code.should.equal(1);
          done();
        });
    });
  });

});
