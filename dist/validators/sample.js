"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class SampleValidator {
    constructor() {
        this.keys = {
            required: "required",
            optional: "optional"
        };
        this.createSchema = joi_1.default.object({
            name: joi_1.default.string().required(),
            description: joi_1.default.string().required()
        });
        this.updateSchema = joi_1.default.object({
            name: joi_1.default.string().required(),
            description: joi_1.default.string().required()
        });
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.createSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.updateSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
    }
}
exports.SampleValidator = SampleValidator;
