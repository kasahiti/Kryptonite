package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.*;
import ch.hesge.kryptonite.jobs.JobStatus;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.services.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;


/**
 * REST controller that handles HTTP requests for creating and retrieving assessments.
 */
@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService service;
    private final AssessmentRepository repository;


    /**
     * Endpoint for creating assessments
     *
     * @param name     name of the assessment
     * @param language language of the assessment
     * @param file     correction file for the assessment
     * @return a ResponseEntity
     * @throws IOException if an IO problem arises
     */
    @PostMapping()
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> createAssessment(
            @RequestParam("name") String name,
            @RequestParam("language") String language,
            @RequestParam("correction") MultipartFile file
    ) throws IOException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String uuid = service.register(name, language, file, user);
        return ResponseEntity.ok().body(uuid);
    }

    /**
     * Modifies an assessment with the given UUID, name, language and correction file.
     *
     * @param uuid     the UUID of the assessment to modify
     * @param name     the new name of the assessment, can be empty to not modify
     * @param language the new language of the assessment, can be null to not modify
     * @param file     the new correction file of the assessment, can be empty to not modify
     * @return a ResponseEntity with a success message or an unauthorized status if the user is not allowed to modify the assessment
     * @throws Exception if there is an error during the modification process
     */
    @PutMapping("/{uuid}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> modifyAssessment(
            @PathVariable String uuid,
            @RequestParam("name") String name,
            @RequestParam("language") Language language,
            @RequestParam("correction") MultipartFile file) throws Exception {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();

        if (!user.getRole().equals(Role.ROLE_ADMIN) && !assessment.getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not allowed to modify this resource!");
        }

        if (!name.isEmpty()) assessment.setName(name);
        if (language != null) assessment.setLanguage(language);

        if (!file.isEmpty()) {
            service.modify(assessment, file);
        }

        // Set all jobs status to NOT_STARTED to restart all jobs
        restartAllJobs(assessment);

        repository.save(assessment);
        return ResponseEntity.ok().body("Assessment modified successfully!");
    }


    /**
     * Restarts all jobs for the assessment with the given UUID.
     *
     * @param uuid the UUID of the assessment to restart jobs for
     * @return a ResponseEntity with a success message or an unauthorized status if the user is not allowed to restart jobs for the assessment
     */
    @PostMapping("/{uuid}/restart")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> restartAssessmentJobs(@PathVariable String uuid) {
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();
        restartAllJobs(assessment);
        repository.save(assessment);

        return ResponseEntity.ok().body("All jobs reloaded for this assessment!");
    }


    /**
     * Retrieves the assessment with the given UUID and returns it as a ResponseEntity.
     *
     * @param uuid the UUID of the assessment to retrieve
     * @return a ResponseEntity containing the assessment as its body or an unauthorized status if the user is not allowed to access the assessment
     */
    @GetMapping("/{uuid}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> getAssessment(@PathVariable String uuid) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();

        if (!user.getRole().equals(Role.ROLE_ADMIN) && !user.equals(assessment.getUser())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not allowed to access this resource!");
        }

        return ResponseEntity.ok().body(assessment);
    }

    /**
     * Endpoint for retrieving assessments for logged-in user, or all assessments for an Admin user
     *
     * @return a ResponseEntity containing a list of Assessments
     */
    @GetMapping()
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Assessment>> getMyAssessments() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (user.getRole().equals(Role.ROLE_ADMIN)) {
            return ResponseEntity.ok().body(repository.findAll());
        } else {
            List<Assessment> assessments = repository.findByUser(user).orElseThrow();
            return ResponseEntity.ok().body(assessments);
        }
    }

    /**
     * Endpoint for retrieving all students project of a specific assessment (by uuid)
     *
     * @return a ResponseEntity containing a list of Assessments
     */
    @GetMapping("/{uuid}/projects")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> getMyAssessments(@PathVariable String uuid) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();

        if (user.getRole().equals(Role.ROLE_ADMIN) || assessment.getUser().equals(user)) {
            return ResponseEntity.ok().body(assessment.getStudentProjects().stream().sorted(Comparator.comparing(StudentProject::getFirstName)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You don't have the rights to access this ressource");
        }
    }


    /**
     * Deletes the assessment with the given UUID.
     *
     * @param uuid the UUID of the assessment to delete
     * @return a ResponseEntity with a success message or an unauthorized status if the user is not allowed to delete the assessment
     */
    @DeleteMapping("/{uuid}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> deleteAssessment(@PathVariable String uuid) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();

        if (user.getRole().equals(Role.ROLE_ADMIN)) {
            repository.delete(assessment);
        } else if (assessment.getUser().equals(user)) {
            repository.delete(assessment);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You don't have the rights to delete this ressource");
        }

        return ResponseEntity.ok().body("Assessment deleted successfully!");
    }


    /**
     * Restarts all jobs for the given assessment by setting all student projects' status to NOT_STARTED and clearing the check50 and style50 results.
     *
     * @param assessment the assessment to restart jobs for
     */
    public void restartAllJobs(Assessment assessment) {
        assessment.getStudentProjects().forEach(studentProject -> {
            studentProject.setStatus(JobStatus.NOT_STARTED);
            studentProject.setCheck50Results("");
            studentProject.setStyle50Results("");
        });
    }
}
