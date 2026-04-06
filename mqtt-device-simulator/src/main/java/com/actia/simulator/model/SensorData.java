package com.actia.simulator.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SensorData {

    private String trainId;
    private String pacisStatus;
    private String cctvStatus;
    private String rearViewStatus;

    public SensorData() {
    }

    public SensorData(String trainId, String pacisStatus, String cctvStatus, String rearViewStatus) {
        this.trainId = trainId;
        this.pacisStatus = pacisStatus;
        this.cctvStatus = cctvStatus;
        this.rearViewStatus = rearViewStatus;
    }

    public String getTrainId() {
        return trainId;
    }

    public void setTrainId(String trainId) {
        this.trainId = trainId;
    }

    public String getPacisStatus() {
        return pacisStatus;
    }

    public void setPacisStatus(String pacisStatus) {
        this.pacisStatus = pacisStatus;
    }

    public String getCctvStatus() {
        return cctvStatus;
    }

    public void setCctvStatus(String cctvStatus) {
        this.cctvStatus = cctvStatus;
    }

    public String getRearViewStatus() {
        return rearViewStatus;
    }

    public void setRearViewStatus(String rearViewStatus) {
        this.rearViewStatus = rearViewStatus;
    }
}
