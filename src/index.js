const mqtt = require("mqtt");
const _ = require("lodash");

module.exports = mqttConfig => {
  const client = mqtt.connect(mqttConfig.url, mqttConfig);
  client.on("connect", () => {
    console.log("MQTT: Connected to", mqttConfig.url);
  });

  client.on("error", err => {
    console.error("MQTT: An error occured", err);
  });
  client.on("close", () => {
    console.log("MQTT: Connection closed");
  });

  return {
    on: client.on.bind(client),
    subscribe: client.subscribe.bind(client),
    publish: (topic, data, opts, cb) => {
      const options = _.merge({}, { retain: true }, opts);
      client.publish(topic, JSON.stringify(data), options, err => {
        if (err) {
          console.error(`MQTT Publish: ${topic}`, err);
        }
        cb && cb(err);
      });
    },
    addSubscriptions: subs => {
      for (let topic in subs) client.subscribe(topic);
      client.on("message", (topic, data) => {
        const msg = JSON.parse(data.toString());
        subs[topic](msg);
      });
    }
  };
};
