var express = require("express");
var router = express.Router();

var hcsController = require("../controllers/hcs");
var response = require("../utils/response");
var logger = require("../utils/logger");

router.post("/send", function (req, res) {
    console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    hcsController.sudmitMsg(req.body, function (err, result) {
      if (err) {
        res.send(response.getResponse(null, err));
      } else {
        res.send(response.getResponse(1, result));
      }
    });
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
});

module.exports = router;
