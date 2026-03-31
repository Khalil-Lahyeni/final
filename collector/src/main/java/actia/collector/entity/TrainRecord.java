package actia.collector.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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

}
