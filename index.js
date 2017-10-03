const assert = require("assert");
const _ = require("lodash");
const mqtt = require("./src");

module.exports = settings => {
  const mqttSettings = {
    url: process.env.MQTT_URL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
  };

  const opts = _.merge({}, mqttSettings, settings);
  assert(opts.url, "MQTT_URL is required");
  return mqtt(opts);
};
