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


/**
 * A REST controller that handles HTTP requests for file storage and retrieval.
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    private final StorageService storageService;
    private final StudentProjectRepository studentRepository;
    private final AssessmentRepository assessmentRepository;


    /**
     * HTTP endpoint for downloading a file.
     * @param filename the name of the file to download
     * @return a ResponseEntity containing the file as a Resource
     */
    @GetMapping("/{filename:.+}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }


    /**
     * HTTP endpoint for uploading a file.
     * @param file the uploaded file
     * @param uuid the UUID associated with the file
     * @param firstName the first name of the student
     * @param lastName the last name of the student
     * @return a ResponseEntity
     */
    @PostMapping("/")
    public ResponseEntity<String> handleFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uuid") String uuid,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName) {
        Assessment assessment = assessmentRepository.findByUuid(uuid).orElseThrow();

        String path = String.valueOf(storageService.store(file, uuid, firstName+"_"+lastName));
        StudentProject project = StudentProject.builder()
                .firstName(firstName)
                .lastName(lastName)
                .status(JobStatus.NOT_STARTED)
                .assessment(assessment)
                .pathFS(path)
                .build();
        studentRepository.save(project);

        return ResponseEntity.ok().body("File uploaded successfully!");
    }


    /**
     * Exception handler for when a requested file is not found.
     * @param exc the exception thrown when a file is not found
     * @return a ResponseEntity with a 404 Not Found status
     */
    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
