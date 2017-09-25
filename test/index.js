const td = require("testdouble");

const mqttConfig = { url: "mqtt://test.bigboat.io" };
let mqttStub = null;
let mqttClient = null;
let publish = null;
let mqtt = null;

describe("MQTT client", () => {
  beforeEach(() => {
    mqttStub = {
      on: td.function(),
      publish: td.function()
    };
    mqtt = td.replace("mqtt");
    td.when(mqtt.connect(mqttConfig.url, mqttConfig)).thenReturn(mqttStub);
    mqttClient = require("../src");
  });

  it("should be able to publish JSON data", () => {
    const res = mqttClient(mqttConfig);
    const data = { test: "val", another: 1 };
    res.publish("/test/topic", data);
    td.verify(
      mqttStub.publish(
        "/test/topic",
        JSON.stringify(data),
        { retain: true },
        td.matchers.isA(Function)
      )
    );
  });
});
