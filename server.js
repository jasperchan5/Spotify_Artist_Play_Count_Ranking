
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";
import dotenv from 'dotenv-defaults';
import router from './router.js';
import path from "path";
const app = express();


// init middleware
app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use('/api/getArtistTracks', router);
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// define server
dotenv.config();
const port = process.env.PORT || 8080;
const address = '0.0.0.0'
const httpServer = http.createServer(app);
httpServer.listen(port, address, () => {
  // const DYNO_URL = "https://jasper-repo-viewer.herokuapp.com";
  // wakeUpDyno(DYNO_URL);
  console.log(`🚀 Server Ready at ${address}:${port}! 🚀`);
});