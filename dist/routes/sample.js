"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sample_1 = require("../controllers/sample");
const sample_2 = require("../validators/sample");
const router = express_1.Router({ mergeParams: true });
const controller = new sample_1.SampleController();
const validator = new sample_2.SampleValidator();
router.route("/").get(controller.getAll).post(validator.create, controller.create);
router
    .route("/:id")
    .get(controller.get)
    .patch(validator.update, controller.update)
    .delete(controller.delete);
exports.default = router;
