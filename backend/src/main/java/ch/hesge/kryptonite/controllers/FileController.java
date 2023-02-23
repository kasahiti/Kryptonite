package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.StudentProject;
import ch.hesge.kryptonite.jobs.JobStatus;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.repositories.StudentProjectRepository;
import ch.hesge.kryptonite.storage.StorageFileNotFoundException;
import ch.hesge.kryptonite.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final StorageService storageService;
    private final StudentProjectRepository studentRepository;
    private final AssessmentRepository assessmentRepository;

    @GetMapping("/{filename:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @PostMapping("/")
    public ResponseEntity<String> handleFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uuid") String uuid,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName) {
        Assessment assessment = assessmentRepository.findByUuid(uuid).orElseThrow();
        StudentProject project = StudentProject.builder()
                .firstName(firstName)
                .lastName(lastName)
                .status(JobStatus.NOT_STARTED)
                .assessment(assessment)
                .fileName(file.getName())
                .build();
        studentRepository.save(project);
        storageService.store(file, uuid, firstName+"_"+lastName);
        return ResponseEntity.ok().body("File uploaded successfully");
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
