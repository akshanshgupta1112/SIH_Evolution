const redis = require("redis");
const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST_NAME,
  password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
  console.log("Client connected");
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", () => {
  console.log("Client disconnected");
});

module.exports = client;
