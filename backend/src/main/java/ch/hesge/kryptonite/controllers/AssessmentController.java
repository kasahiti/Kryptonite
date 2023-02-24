package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.services.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService service;
    private final AssessmentRepository repository;

    @PostMapping()
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> createAssessment(
            @RequestParam("name") String name,
            @RequestParam("language") String language,
            @RequestParam("correction") MultipartFile file
    ) throws IOException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.register(name, language, file, user);
        return ResponseEntity.ok().body("Assessment created!");
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Assessment>> getMyAssessments() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Assessment> assessments = repository.findByUser(user).orElseThrow();
        return ResponseEntity.ok().body(assessments);
    }
}
