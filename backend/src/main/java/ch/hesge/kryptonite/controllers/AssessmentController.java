package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.payload.request.AssessmentRequest;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.services.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService service;
    private final AssessmentRepository repository;

    @PostMapping()
    public ResponseEntity<String> createAssessment(@RequestBody AssessmentRequest request) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        service.register(request, user);
        return ResponseEntity.ok().body("Assessment created!");
    }

    @GetMapping()
    public ResponseEntity<List<Assessment>> getMyAssessments() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Assessment> assessments = repository.findByUser(user).orElseThrow();
        assessments.forEach(System.out::println);
        return ResponseEntity.ok().body(assessments);
    }
}
