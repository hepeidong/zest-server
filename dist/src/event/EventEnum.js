export var event;
(function (event) {
    event["TEST_MESSAGE"] = "testMessage";
    event["HEARTBEAT"] = "heartbeatMessage";
})(event || (event = {}));
