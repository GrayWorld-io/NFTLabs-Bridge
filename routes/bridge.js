var express = require("express");
var router = express.Router();

var bridgeController = require("../controllers/bridge");
var response = require("../utils/response");
var logger = require("../utils/logger");


router.post("/getLockAssets", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await bridgeController.getLockAssets(req.body);
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/getLockTx", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await bridgeController.getLockTx(req.body);
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/getMintTx", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await bridgeController.getMintTx(req.body);
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/getMessage", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await bridgeController.getMessage(req.body);
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/sendLockTx", async (req, res) => {
  try {
    let response = await bridgeController.sendLockTx(req.body);
    console.log(response)
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});


router.post("/sendWithdrawTx", async (req, res) => {
  try {
    let response = await bridgeController.sendWithdrawTx(req.body);
    console.log(response)
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

router.post("/getWithdrawTx", async (req, res) => {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    let response = await bridgeController.getWithdrawTx(req.body);
    res.send({
      result: response
    })
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});
module.exports = router;
