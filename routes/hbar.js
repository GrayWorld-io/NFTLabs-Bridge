var express = require("express");
var router = express.Router();

var hbarController = require("../controllers/hbar");
var response = require("../utils/response");
var logger = require("../utils/logger");

router.post("/transfer", function (req, res) {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    hbarController.transferHbar(req.body, function (err, result) {
      if (err) {
        res.send(response.getResponse(null, err));
      } else {
        res.send(response.getResponse(1, null));
      }
    });
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

module.exports = router;
