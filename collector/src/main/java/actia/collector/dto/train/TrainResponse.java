package actia.collector.dto.train;

public record TrainResponse(
        String trainId,
        String pacisStatus,
        String cctvStatus,
        String rearViewStatus
) {}
