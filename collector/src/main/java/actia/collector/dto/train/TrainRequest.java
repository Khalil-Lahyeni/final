package actia.collector.dto.train;

import jakarta.validation.constraints.NotBlank;

public record TrainRequest(

        @NotBlank(message = "trainId is required")
        String trainId,
        String pacisStatus,
        String cctvStatus,
        String rearViewStatus
) {}
