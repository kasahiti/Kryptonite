package ch.hesge.kryptonite.jobs;

import ch.hesge.kryptonite.domain.StudentProject;
import ch.hesge.kryptonite.repositories.StudentProjectRepository;
import ch.hesge.kryptonite.utils.TerminalRunner;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;


/**
 * A Spring component that performs automatic checks on student projects at a fixed rate.
 */
@Component
@RequiredArgsConstructor
public class JobScheduler {
    private final StudentProjectRepository repository;
    private final Logger log = LoggerFactory.getLogger(JobScheduler.class);


    /**
     * A scheduled method that performs automatic checks on student projects at a fixed rate.
     * Retrieve all student projects with JobStatus=NOT_STARTED. If there's any, takes the first, and perform check50
     * on it, stores the json result in it, changes the status and save the changes using the repository
     */
    @Scheduled(fixedRate = 20000)
    public void startCorrection() {
        log.info("Performing automatic checks");

        List<StudentProject> projects = repository.findByStatus(JobStatus.NOT_STARTED).get();
        if (!projects.isEmpty()) {
            StudentProject project = projects.get(0);
            project.setStatus(JobStatus.STARTED);
            repository.save(project);

            log.info("Performing check50 on student's project...");
            String check50 = TerminalRunner.shell(
                    "check50",
                    project.getPathFS(),
                    "--dev", project.getAssessment().getCheck50DataPath(),
                    "-o", "json"
            );

            log.info("Performing style50 on student's project...");
            // Use bash to correctly interpret the wildcard
            String style50 = TerminalRunner.shell(
                    "bash",
                    project.getPathFS(),
                    "-c",
                    "style50 -o json *.*"
            );

            project.setCheck50Results(check50);
            project.setStyle50Results(style50);
            project.setStatus(JobStatus.DONE);
            repository.save(project);
            log.info("Check50 done.");
        }
    }
}
