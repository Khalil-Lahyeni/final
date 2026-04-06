package actia.collector.service;

import actia.collector.dto.train.TrainRequest;
import actia.collector.entity.TrainRecord;
import actia.collector.repository.TrainRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttMessageHandlerImpl implements MqttMessageHandler {

    private static final Logger log = LoggerFactory.getLogger(MqttMessageHandlerImpl.class);

    private final ObjectMapper objectMapper;
    private final TrainRepository trainRepository;

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<String> message) {
        String payload = message.getPayload();
        String topic = message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC, String.class);
        handle(payload, topic == null ? "unknown" : topic);
    }

    @Override
    public void handle(String payload, String topic) {
        try {
            TrainRequest request = objectMapper.readValue(payload, TrainRequest.class);

            if (request.trainId() == null || request.trainId().isBlank()) {
                log.warn("Ignoring MQTT message without trainId on topic {}: {}", topic, payload);
                return;
            }

            TrainRecord record = trainRepository.findById(request.trainId())
                    .orElse(new TrainRecord());

            record.setTrainId(request.trainId());
            record.setPacisStatus(request.pacisStatus());
            record.setCctvStatus(request.cctvStatus());
            record.setRearViewStatus(request.rearViewStatus());

            trainRepository.save(record);
            log.info("Saved train status from MQTT topic {} for train {}", topic, request.trainId());
        } catch (Exception e) {
            log.error("Failed to process MQTT message from topic {}: {}", topic, e.getMessage());
        }
    }
}
