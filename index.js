const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./src/routes/routes");
const logger = require("./src/servives/logging");
const MongoDB = require("./src/db/mongo");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const cluster = require("cluster");
const helmet = require("helmet");
const admin = require("./src/routes/adminRoutes");
const { client, redisServer } = require("./src/db/redis");
// require('./practise')

// const numCPUs = require("os").cpus().length;

const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again later.",
});

// app.use(limiter);
app.use(cors()); // TODO : use cors Options
// app.use(helmet.xssFilter());
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
app.use(`/admin/v1`, admin);

app.get("/health", async (req, res) => {
  res.status(200).send("server running");
});
app.get("/", async (req, res) => {
  res.status(200).send("server running");
});

// if (cluster.isMaster) {
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     cluster.fork();
//   });
// } else {
  app
    .listen(process.env.PORT, () => {
      console.log(`Server Listning on: ${process.env.PORT}`);
    })
    .on("listening", () => {
      MongoDB.connect()
        .then(() => {
          redisServer().then((res)=>{
            console.log(res)
          }).catch((err)=>console.log(err))
          console.log(
            `Server Running on: http://localhost:${process.env.PORT}/health`
          );
        })
        .catch((err) => {
          console.log("DATABASE CONNECTING ERROR", err);
        });
    });
// }
