package actia.collector.service;

import actia.collector.dto.train.TrainResponse;
import actia.collector.mapper.TrainMapper;
import actia.collector.repository.TrainRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TrainServiceImpl implements TrainService {
    private final TrainRepository repository;
    private final TrainMapper mapper;

    @Override
    public List<TrainResponse> getAllTrains() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public TrainResponse getTrainById(String trainId) {
        return repository.findById(trainId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Train not found: " + trainId));
    }
}
