const request = require("supertest");
const should = require("should");
const {Transaction, PrivateKey} = require("@hashgraph/sdk")

const constant = require("./test_constant");

const point = require("../app");

let tx = '';

describe("bridge all", function() {
  this.timeout(6000);

  before( (done) => {
    
    done();
  })

  describe.skip("POST /bridge/getLockTx", function() {
    it("[bridge] should get bridge Lock transaction correctly", function(done) {
      request(point)
        .post("/bridge/getLockTx")
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

  describe.skip("sign tx", function() {
    it("[bridge] should sign transaction correctly", async function(done) {
      console.log(Transaction.fromBytes(Buffer.from(tx.data).toString("base64")))
      // tx = await Transaction.fromBytes(tx).sign(PrivateKey.fromString(constant.getUser().key));
      // console.log('signedTx:');
      // console.log(tx);
      done();
    });
  });

  describe.skip("POST /bridge/sendLockTx", function() {
    it("[bridge] should get bridge Lock transaction correctly", function(done) {
      request(point)
        .post("/bridge/sendLockTx")
        .type("json")
        .send(JSON.stringify({
          signedTx: tx,
          network: 'hedera'
        }))
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          // should.exist(res.body.result);
          // res.body.result.should.equal(1);
          done();
        });
    });
  });

  describe("POST /bridge/getLockAssets", function() {
    it("[bridge] should get bridge Lock assets correctly", function(done) {
      request(point)
        .post("/bridge/getLockAssets")
        .type("json")
        .send(JSON.stringify({
          network: 'hedera',
          accountId: '0.0.26556813'
        }))
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          // should.exist(res.body.result);
          // res.body.result.should.equal(1);
          done();
        });
    });
  });

  // describe("POST /claim", function() {
  //   it("[hedera][freshman] should create claim transaction correctly", function(done) {
  //     request(point)
  //       .post("/mint/claim")
  //       .type("json")
  //       .send(JSON.stringify(constant.mintHederaFreshMan()))
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) throw err;
  //         console.log(res.body);
  //         // should.exist(res.body.result);
  //         // res.body.result.should.equal(1);
  //         done();
  //       });
  //   });

  // });
});
