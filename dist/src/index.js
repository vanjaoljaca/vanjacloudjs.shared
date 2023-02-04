"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("../keys"));
const notion_1 = require("./notion");
const openai_1 = require("./openai");
exports.default = {
  Keys: keys_1.default,
  myThing: 99,
  ThoughtDB: notion_1.ThoughtDB,
  getOrCreateCompletion: openai_1.getOrCreateCompletion
};
//# sourceMappingURL=index.js.map