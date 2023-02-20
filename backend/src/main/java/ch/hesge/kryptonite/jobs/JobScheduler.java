package ch.hesge.kryptonite.jobs;

import ch.hesge.kryptonite.domain.StudentProject;
import ch.hesge.kryptonite.repositories.StudentProjectRepository;
import ch.hesge.kryptonite.services.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JobScheduler {
    private final StudentProjectRepository repository;
    private final Logger log = LoggerFactory.getLogger(JobScheduler.class);
    private final SimpleDateFormat date = new SimpleDateFormat("HH:mm:ss");

    @Scheduled(fixedRate = 20000)
    public void startCorrection() {
        log.info("The time is now {}", date.format(new Date()));
        List<StudentProject> projects = repository.findByStatus(JobStatus.NOT_STARTED).get();
        if (projects.size() > 0) {
            StudentProject project = projects.get(0);
            project.setStatus(JobStatus.STARTED);
            repository.save(project);
        }
    }
}
