package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.payload.request.AssessmentRequest;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.services.AssessmentService;
import ch.hesge.kryptonite.services.FSStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService service;
    private final AssessmentRepository repository;

    private final FSStorageService storageService;

    @PostMapping()
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> createAssessment(@RequestBody AssessmentRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String uuid = service.register(request, user);
        storageService.createCheck50Dir(uuid, request.getCorrection());
        return ResponseEntity.ok().body("Assessment created!");
    }

    @GetMapping()
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Assessment>> getMyAssessments() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Assessment> assessments = repository.findByUser(user).orElseThrow();
        assessments.forEach(System.out::println);
        return ResponseEntity.ok().body(assessments);
    }
}
