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
exports.SampleController = void 0;
const main_1 = require("../storage/main");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class SampleController {
    constructor() {
        this.getAll = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const samples = yield main_1.storage.sample.find(req.query);
            res.status(200).json({
                success: true,
                data: {
                    samples
                }
            });
        }));
        this.get = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const sample = yield main_1.storage.sample.findById(req.params.id);
            res.status(200).json({
                success: true,
                data: {
                    sample
                }
            });
        }));
        this.create = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const sample = yield main_1.storage.sample.create(req.body);
            res.status(201).json({
                success: true,
                data: {
                    sample
                }
            });
        }));
        this.update = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const sample = yield main_1.storage.sample.update(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: {
                    sample
                }
            });
        }));
        this.delete = catchAsync_1.default((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield main_1.storage.sample.delete(req.params.id);
            res.status(204).json({
                success: true,
                data: null
            });
        }));
    }
}
exports.SampleController = SampleController;
