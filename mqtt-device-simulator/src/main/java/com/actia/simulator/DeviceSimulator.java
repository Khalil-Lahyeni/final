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

    @Value("${simulator.device.id}")
    private String deviceId;

    @Value("${simulator.broker.url}")
    private String brokerUrl;

    private MqttClient client;
    private final ObjectMapper objectMapper;
    private final Random random = new Random();
    private int publishCount = 0;

    // Simulate gradual sensor changes
    private double currentTemp = 22.0;
    private double currentHumidity = 55.0;
    private double currentLat = 33.8815;    // Gabès, Tunisia
    private double currentLng = 10.0982;

    public DeviceSimulator() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        try {
            client = new MqttClient(brokerUrl, deviceId + "-simulator", new MemoryPersistence());

            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setAutomaticReconnect(true);
            options.setConnectionTimeout(10);
            client.connect(options);
            publishStatus("ONLINE");

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
            publishCount++;
            switch (publishCount % 4) {
                case 0 -> publishTemperature();
                case 1 -> publishHumidity();
                case 2 -> publishGps();
                case 3 -> publishStatus(randomStatus());
            }
        } catch (Exception e) {
            log.error("Publish error: {}", e.getMessage());
        }
    }

    // ─── Sensor Publishers ───────────────────────────────────

    private void publishTemperature() throws Exception {
        currentTemp += (random.nextDouble() - 0.48) * 2;
        currentTemp = clamp(currentTemp, 15, 50);

        SensorData data = SensorData.builder()
                .deviceId(deviceId)
                .sensorType("temperature")
                .value(round(currentTemp))
                .unit("°C")
                .build();

        publish("devices/temperature", data);
        log.info("Published temperature: {} °C", data.getValue());
    }

    private void publishHumidity() throws Exception {
        currentHumidity += (random.nextDouble() - 0.5) * 5;
        currentHumidity = clamp(currentHumidity, 20, 95);

        SensorData data = SensorData.builder()
                .deviceId(deviceId)
                .sensorType("humidity")
                .value(round(currentHumidity))
                .unit("%")
                .build();

        publish("devices/humidity", data);
        log.info("Published humidity: {} %", data.getValue());
    }

    private void publishGps() throws Exception {
        currentLat += (random.nextDouble() - 0.5) * 0.001;
        currentLng += (random.nextDouble() - 0.5) * 0.001;

        SensorData data = SensorData.builder()
                .deviceId(deviceId)
                .sensorType("gps")
                .latitude(round(currentLat, 4))
                .longitude(round(currentLng, 4))
                .build();

        publish("devices/gps", data);
        log.info("Published GPS: {}, {}", data.getLatitude(), data.getLongitude());
    }

    private void publishStatus(String status) {
        try {
            SensorData data = SensorData.builder()
                    .deviceId(deviceId)
                    .sensorType("status")
                    .status(status)
                    .build();

            publish("devices/status", data);
            log.info("Published status: {}", status);
        } catch (Exception e) {
            log.error("Failed to publish status: {}", e.getMessage());
        }
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

    private String randomStatus() {
        String[] statuses = {"ONLINE", "ONLINE", "ONLINE", "MAINTENANCE", "ERROR"};
        return statuses[random.nextInt(statuses.length)];
    }

    private double clamp(double val, double min, double max) {
        return Math.max(min, Math.min(max, val));
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    private double round(double val, int decimals) {
        double factor = Math.pow(10, decimals);
        return Math.round(val * factor) / factor;
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (client != null && client.isConnected()) {
                publishStatus("OFFLINE");
                Thread.sleep(500);
                client.disconnect();
                log.info("🔌 Simulator disconnected cleanly");
            }
        } catch (Exception e) {
            log.error("Cleanup error: {}", e.getMessage());
        }
    }
}
