package actia.collector.service;

import actia.collector.dto.train.TrainResponse;

import java.util.List;

public interface TrainService {
    List<TrainResponse> getAllTrains();

    TrainResponse getTrainById(String trainId);
}
