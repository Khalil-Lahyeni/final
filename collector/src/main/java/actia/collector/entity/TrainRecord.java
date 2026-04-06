package actia.collector.entity;

import jakarta.persistence.*;

@Entity
public class TrainRecord {
    @Id
    @Column(name = "train_id", nullable = false, unique = true)
    private String trainId;

    @Column(name = "pacis_status")
    private String pacisStatus;

    @Column(name = "cctv_status")
    private String cctvStatus;

    @Column(name = "rear_view_status")
    private String rearViewStatus;

    public TrainRecord() {
    }

    public TrainRecord(String trainId, String pacisStatus, String cctvStatus, String rearViewStatus) {
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
