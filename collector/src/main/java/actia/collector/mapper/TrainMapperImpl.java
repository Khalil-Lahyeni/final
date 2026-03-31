package actia.collector.mapper;

import actia.collector.dto.train.TrainRequest;
import actia.collector.dto.train.TrainResponse;
import actia.collector.entity.TrainRecord;
import org.springframework.stereotype.Component;

@Component
public class TrainMapperImpl implements TrainMapper {

    /**
     * RequestDTO → TrainRecord (insert ou update).
     */
    public TrainRecord toModel(TrainRequest dto) {
        return new TrainRecord(
                dto.trainId(),
                dto.pacisStatus(),
                dto.cctvStatus(),
                dto.rearViewStatus()
        );
    }

    /**
     * TrainRecord → ResponseDTO.
     */
    public TrainResponse toResponse(TrainRecord record) {
        return new TrainResponse(
                record.getTrainId(),
                record.getPacisStatus(),
                record.getCctvStatus(),
                record.getRearViewStatus()
        );
    }
}
