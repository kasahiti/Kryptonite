package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.Role;
import ch.hesge.kryptonite.domain.StudentProject;
import ch.hesge.kryptonite.domain.User;
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

    @GetMapping("/{uuid}")
    public ResponseEntity<String> getAssessmentByUUID(@PathVariable String uuid) {
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();
        return ResponseEntity.ok().body(assessment.getName());
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
            return ResponseEntity.ok().body(assessment.getStudentProjects());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You don't have the rights to access this ressource");
        }
    }

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
}
