package ch.hesge.kryptonite.repositories;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    Optional<List<Assessment>> findByUser(User user);

    Optional<Assessment> findByUuid(String uuid);
}
