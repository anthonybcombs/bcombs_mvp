const redis = require("redis");
const client = redis.createClient();
client.on("error", function (error) {
  console.error(error);
});
client.on("connect", () => {
  console.log("connect");
});

export const getRedisKey = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (getError, result) => {
      if (getError) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
export default client;
