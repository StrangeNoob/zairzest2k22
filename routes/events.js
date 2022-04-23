const express = require("express");
const router = express.Router();

const controller = require("../controllers/events");
const validator = require("../validators/events");

router.post(
  "/registerEvent/:eventId",
  validator.postRegisterEvent,
  controller.postRegisterEvent
);
router.post(
  "/deregisterEvent/:eventId",
  validator.postDeRegisterEvent,
  controller.postDeRegisterEvent
);
router.get(
  "/:category",
  validator.getAllByCategory,
  controller.getAllByCategory
);

module.exports = router;
