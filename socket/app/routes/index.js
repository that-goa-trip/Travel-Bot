const router = require("express").Router();
const controller = require("../controllers/apis");

// These endpoints are for internal use, i.e. they are meant to be accessed through 'localhost' urls
// This app isn't exposed to inbound requests coming via the Internet, so we're not using authentication.

router.post("/emit-to-group", controller.emitToGroup);

module.exports = router;
