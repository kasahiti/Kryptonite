package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.services.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    private final AssessmentRepository repository;

    @GetMapping("/assessments/{uuid}")
    public ResponseEntity<String> getAssessmentByUUID(@PathVariable String uuid) {
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();
        return ResponseEntity.ok().body(assessment.getName());
    }
}
