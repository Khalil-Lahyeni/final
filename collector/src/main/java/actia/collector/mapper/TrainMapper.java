package actia.collector.mapper;

import actia.collector.dto.train.TrainRequest;
import actia.collector.dto.train.TrainResponse;
import actia.collector.entity.TrainRecord;

public interface TrainMapper {

    /** RequestDTO → TrainRecord */
    TrainRecord toModel(TrainRequest dto);

    /** TrainRecord → ResponseDTO */
    TrainResponse toResponse(TrainRecord record);
}
