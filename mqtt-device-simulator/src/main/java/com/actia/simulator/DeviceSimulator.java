package com.actia.simulator;

import com.actia.simulator.model.SensorData;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.Random;

@Component
public class DeviceSimulator {

    private static final Logger log = LoggerFactory.getLogger(DeviceSimulator.class);

    @Value("${simulator.train.id}")
    private String trainId;

    @Value("${simulator.broker.url}")
    private String brokerUrl;

    private MqttClient client;
    private final ObjectMapper objectMapper;
    private final Random random = new Random();

    public DeviceSimulator() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        try {
            client = new MqttClient(brokerUrl, trainId + "-simulator", new MemoryPersistence());

            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setAutomaticReconnect(true);
            options.setConnectionTimeout(10);
            client.connect(options);
            log.info("Simulator connected for train {}", trainId);

        } catch (Exception e) {
            log.error("Failed to connect to broker: {}", e.getMessage());
        }
    }

    // ─── Scheduled Publishing ────────────────────────────────

    @Scheduled(fixedDelayString = "${simulator.interval.ms}")
    public void publishSensorData() {
        if (client == null || !client.isConnected()) {
            log.warn("Not connected to broker, skipping...");
            return;
        }

        try {
            publishTrainStatus();
        } catch (Exception e) {
            log.error("Publish error: {}", e.getMessage());
        }
    }

    private void publishTrainStatus() throws Exception {
        SensorData data = new SensorData(
            trainId,
            randomEquipmentStatus(),
            randomEquipmentStatus(),
            randomEquipmentStatus()
        );

        String topic = String.format("fleet/trains/%s/status", trainId);
        publish(topic, data);
        log.info("Published train status: {}", data);
    }

    // ─── MQTT Publish ────────────────────────────────────────

    private void publish(String topic, SensorData data) throws Exception {
        String json = objectMapper.writeValueAsString(data);
        MqttMessage message = new MqttMessage(json.getBytes());
        message.setQos(1);
        message.setRetained(false);
        client.publish(topic, message);

        log.debug("   → Topic: {}  |  Payload: {}", topic, json);
    }

    // ─── Helpers ─────────────────────────────────────────────

    private String randomEquipmentStatus() {
        String[] statuses = {"OK", "OK", "OK", "WARNING", "ERROR", "MAINTENANCE"};
        return statuses[random.nextInt(statuses.length)];
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (client != null && client.isConnected()) {
                client.disconnect();
                log.info("Simulator disconnected cleanly");
            }
        } catch (Exception e) {
            log.error("Cleanup error: {}", e.getMessage());
        }
    }
}
