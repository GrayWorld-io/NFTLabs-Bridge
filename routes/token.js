var express = require("express");
var router = express.Router();

var hederaTokenController = require("../controllers/hedera/token");
var response = require("../utils/response");
var logger = require("../utils/logger");

router.post("/getAssociateTx", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await hederaTokenController.tokenAssociate(req.body);
    res.send({
      tx: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

module.exports = router;
