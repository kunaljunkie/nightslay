const { createClient } = require("redis");
const client = createClient();

const redisServer = async () => {
  let redisStatus = "not Initialised";

  await client.on("error", (err) => {
    console.error("Redis connection error:", err);
    redisStatus = `Redis connection error:', ${err}`;
  });

  await client
    .connect()
    .then(async () => {
      console.log("Connected to Redis");
      redisStatus = `connected ` ;
      await client.select(0);
    })
    .catch((err) => {
      console.error("Failed to connect to Redis:", err);
      redisStatus = `'Failed to connect to Redis:', ${err}`;
    });
  return redisStatus;
};

const SetCache = async (key, value) => {
  const prefix = key;
  const data = value;

  const fullPrefix = `${process.env.REDIS_FOLDER}:${prefix}`;
  const JSONdata = JSON.stringify(data);

  const isclientSet = await client.set(fullPrefix, JSONdata);
  return isclientSet
};

const GetCache = async (key) => {

  const prefix = key

  const fullprefix = `${process.env.REDIS_FOLDER}:${prefix}`;

  const jsonString = await client.get(fullprefix);

  const jsonData = JSON.parse(jsonString);

  return jsonData
};

module.exports = {
  client: client,
  redisServer: redisServer,
  SetCache: SetCache,
  GetCache: GetCache

};
