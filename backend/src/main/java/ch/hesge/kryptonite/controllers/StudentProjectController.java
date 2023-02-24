package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.StudentProject;
import ch.hesge.kryptonite.repositories.StudentProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


/**
 * A REST controller that handles HTTP requests for student projects.
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentProjectController {
    private final StudentProjectRepository repository;


    /**
     * HTTP endpoint for retrieving all student projects.
     * @return a ResponseEntity containing all student projects
     */
    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentProject>> getAllProjects() {
        List<StudentProject> projects = repository.findAll();
        return ResponseEntity.ok().body(projects);
    }
}
