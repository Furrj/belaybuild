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
// import * as dotenv from "dotenv";
// dotenv.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
//MONGO
require("./models/User");
const User = mongoose_1.default.model("User");
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
process.env.MONGO_URI && mongoose_1.default.connect(process.env.MONGO_URI);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
//SESSION
process.env.SESSION_SECRET &&
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { httpOnly: true, maxAge: 60 },
    }));
//PASSPORT
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new passport_local_1.Strategy(User.authenticate()));
passport_1.default.serializeUser(User.serializeUser());
passport_1.default.deserializeUser(User.deserializeUser());
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "build")));
//ROUTES
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "build", "index.html"));
});
app.post("/login", (req, res) => {
    console.log(req.body);
    res.json("Successful post request");
});
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new User({
        username: "Poemmys",
        password: "ballz",
    });
    yield newUser.save();
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const regCheck = yield User.exists({ username: username });
        if (regCheck) {
            res.json("Taken");
            console.log("Taken");
        }
        else {
            const newUser = new User({
                username,
            });
            const regUser = yield User.register(newUser, password);
            res.json("Registered");
            console.log(regUser);
        }
    }
    catch (e) {
        console.log(`Error: ${e}`);
        res.json(`Error: ${e}`);
    }
}));
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});
