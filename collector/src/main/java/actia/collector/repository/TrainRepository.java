package actia.collector.repository;

import actia.collector.entity.TrainRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainRepository extends JpaRepository<TrainRecord, String> {
}
