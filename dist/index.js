"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const math_1 = require("./math");
const PORT = 8888;
const app = express_1.default();
app.use(morgan_1.default('dev'))
    .get('/', (req, res) => {
    res.end('hello world');
})
    .get('/err', (req, res) => {
    try {
        throw new Error('weee i am a bug!');
    }
    catch (e) {
        console.trace(e);
        res.end('meow!!!');
    }
})
    .get('/debug', (req, res) => {
    const sum = math_1.add(1, 2);
    res.end(`the sum is ${sum}`);
})
    .listen(PORT, () => {
    console.log(`listening on localhost:${PORT}...`);
});
//# sourceMappingURL=index.js.map