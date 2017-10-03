const td = require("testdouble");

const mqttConfig = {
  url: "mqtt://mqtt.test.server:8883",
  username: "test-user",
  password: "test-pass"
};

describe("MQTT client", () => {
  let _mqtt = null;
  let mqtt = null;
  let client = null;

  beforeEach(() => {
    _mqtt = td.replace("mqtt");
    client = {
      on: td.function(".on"),
      subscribe: td.function(".subscribe"),
      publish: td.function(".publish")
    };
    td.when(_mqtt.connect(mqttConfig.url, mqttConfig)).thenReturn(client);
    mqtt = require("../src");
  });

  afterEach(td.reset);

  it("should invoke mqtt.js connect with the correct config", () => {
    mqtt(mqttConfig);
    td.verify(client.on("connect", td.matchers.isA(Function)));
    td.verify(client.on("error", td.matchers.isA(Function)));
    td.verify(client.on("close", td.matchers.isA(Function)));
  });

  it("should return a publish function", () => {
    const mc = mqtt(mqttConfig);
    const data = { test: "val", another: 1 };
    mc.publish("/my/topic", data);
    td.verify(
      client.publish(
        "/my/topic",
        JSON.stringify(data),
        { retain: true },
        td.matchers.isA(Function)
      )
    );
  });

  it("should return an addSubscriptions function", () => {
    const mc = mqtt(mqttConfig);
    const subs = {
      "/test/topic/1": td.function(),
      "/test/topic/2": td.function(),
      "/test/topic/3": td.function()
    };
    mc.addSubscriptions(subs);
    td.verify(client.subscribe("/test/topic/1"));
    td.verify(client.subscribe("/test/topic/2"));
    td.verify(client.subscribe("/test/topic/3"));
    td.verify(client.on("message", td.matchers.isA(Function)));
  });
});
