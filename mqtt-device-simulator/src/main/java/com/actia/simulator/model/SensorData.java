package com.actia.simulator.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SensorData {

    @JsonProperty("device_id")
    private String deviceId;

    @JsonProperty("sensor_type")
    private String sensorType;

    private Double value;

    private String unit;

    private Double latitude;
    private Double longitude;

    private String status;
}
