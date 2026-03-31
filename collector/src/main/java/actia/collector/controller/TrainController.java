package actia.collector.controller;

import actia.collector.dto.train.TrainResponse;
import actia.collector.service.TrainService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/collector/trains")
@AllArgsConstructor
public class TrainController {
    private final TrainService trainService;

    /** GET /collector/trains */
    @GetMapping
    public ResponseEntity<List<TrainResponse>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    /** GET /collector/trains/{trainId} */
    @GetMapping("/{trainId}")
    public ResponseEntity<TrainResponse> getTrainById(
            @PathVariable String trainId) {
        return ResponseEntity.ok(trainService.getTrainById(trainId));
    }
}
