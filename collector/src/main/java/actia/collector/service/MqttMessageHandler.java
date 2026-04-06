package actia.collector.service;

public interface MqttMessageHandler {
	void handle(String payload, String topic);
}
