package ch.hesge.kryptonite.repositories;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.StudentProject;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.jobs.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProjectRepository extends JpaRepository<StudentProject, Long> {
    Optional<List<StudentProject>> findByStatus(JobStatus status);
}
