"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const morgan_1 = __importDefault(require("morgan"));
const mongoData_1 = __importDefault(require("./mongoData"));
// SETTING UP APP
const app = express_1.default();
const port = process.env.PORT || 3000;
// MIDDLEWARES
app.use(cors_1.default());
app.use(morgan_1.default(':method :url :status :res[content-length] - :response-time ms'));
app.use(express_1.default.json());
// ROUTES
app.get('/', (req, res) => {
    res.status(200).json({ msg: "hello World" });
});
app.post('/new/channel', (req, res) => {
    const dbData = req.body;
    mongoData_1.default.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    });
});
app.get('/get/channelList', (req, res) => {
    mongoData_1.default.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            let channels = [];
            data.forEach((channelInfo) => {
                const channelData = {
                    id: channelInfo._id,
                    name: channelInfo.channelName,
                };
                channels.push(channelData);
            });
            res.status(200).send(channels);
        }
    });
});
app.post('/new/message', (req, res) => {
    const id = req.query.id;
    const reqMessage = req.body;
    mongoData_1.default.update({ _id: id }, { $push: { conversation: reqMessage } }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    });
});
app.get('/get/conversation', (req, res) => {
    const id = req.query.id;
    mongoData_1.default.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    });
});
// SETTING UP DB AND INITAILIZING APP
mongoose_1.default.connect(process.env.MONGO_DB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then((conn) => {
    console.log("DB CONNECTED via. " + conn.connection.host);
}).then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    });
}).catch((err) => {
    console.log(err.message);
});
//# sourceMappingURL=server.js.map