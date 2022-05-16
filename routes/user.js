var express = require("express");
var router = express.Router();

var userController = require("../controllers/user");
var response = require("../utils/response");
var logger = require("../utils/logger");

router.post("/signup", function (req, res) {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    userController.signup(req.body, function (err, result) {
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

router.post("/login", function (req, res) {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    userController.login(req.body, function (err, result) {
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

router.post("/assets", function (req, res) {
  console.log(req.url + " post body: " + JSON.stringify(req.body));
  try {
    userController.getAssets(req.body, function (err, result) {
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
