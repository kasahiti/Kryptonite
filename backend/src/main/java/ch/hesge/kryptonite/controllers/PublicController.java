package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * Controller class for publicly accessible endpoints related to assessments.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    private final AssessmentRepository repository;


    /**
     * Retrieves the name of the assessment with the given UUID and returns it as a ResponseEntity.
     *
     * @param uuid the UUID of the assessment to retrieve
     * @return a ResponseEntity containing the name of the assessment as its body
     */
    @GetMapping("/assessments/{uuid}")
    public ResponseEntity<String> getAssessmentByUUID(@PathVariable String uuid) {
        Assessment assessment = repository.findByUuid(uuid).orElseThrow();
        return ResponseEntity.ok().body(assessment.getName());
    }
}
