/**
 * Watches Redis for new indices. Pulls each new index, calculates the corresponding
 * Fibbonarci value and stores back into Redis.
 */

const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000, // Tell Redis client to attempt to reconnect to the Redis server once every 1000ms
});
const sub = redisClient.duplicate(); // sub stands for subscription so that we can watch Redis

// We are purposefully using a very slow implementation of the fibbonarci sequence
// do demonstrate why a separate worker process is important
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// sub is our subscription object to Redis
sub.on("message", (channel, message) => {
  // 'channel' and 'message' are input parameters to the callback function
  // Anytime we get a new a value in Redis, we calculate the fibbonarci
  // value and insert into a hash called 'values', where the key
  // is 'message' (i.e. index that was submitted) and we store
  // the value that we calculated using the fib function.
  redisClient.hset("values", message, fib(parseInt(message)));
});
// Here we subscribe to 'insert' events.
sub.subscribe("insert");
