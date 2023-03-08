package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.Role;
import ch.hesge.kryptonite.domain.StudentProject;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.jobs.JobStatus;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.repositories.StudentProjectRepository;
import ch.hesge.kryptonite.storage.StorageFileNotFoundException;
import ch.hesge.kryptonite.storage.StorageService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


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

    private final List<String> extensions = Arrays.asList("zip", "rar", "7z");


    /**
     * HTTP endpoint for downloading a project.
     * Sources :
     * * <a href="https://www.codejava.net/java-se/file-io/zip-directories">codejava.net</a>
     * * <a href="https://www.tutorialsbuddy.com/how-to-zip-multiple-files-for-download-in-spring-boot">tutorialsbuddy.com</a>
     *
     * @param response  the http servlet response
     * @param uuid      the uuid of the assessment
     * @param studentId the student id used to locate the folder to zip
     * @return a ResponseEntity containing the zip file
     */
    @GetMapping("/{uuid}/{studentId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<StreamingResponseBody> downloadZip(HttpServletResponse response, @PathVariable String uuid, @PathVariable Long studentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Assessment assessment = assessmentRepository.findByUuid(uuid).orElseThrow();
        Set<StudentProject> projects = assessment.getStudentProjects();

        if (!assessment.getUser().equals(user) && !user.getRole().equals(Role.ROLE_ADMIN)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(outputStream -> {
            });
        }

        List<File> files = new ArrayList<>();

        for (StudentProject studentProject : projects) {
            if (Objects.equals(studentProject.getId(), studentId)) {
                Collections.addAll(files, Objects.requireNonNull(new File(studentProject.getPathFS()).listFiles()));
            }
        }

        int BUFFER_SIZE = 1024;

        StreamingResponseBody streamResponseBody = out -> {
            final ZipOutputStream zipOutputStream = new ZipOutputStream(response.getOutputStream());
            ZipEntry zipEntry = null;
            InputStream inputStream = null;

            try {
                for (File file : files) {
                    zipEntry = new ZipEntry(file.getName());
                    inputStream = new FileInputStream(file);
                    zipOutputStream.putNextEntry(zipEntry);

                    byte[] bytes = new byte[BUFFER_SIZE];
                    int length;

                    while ((length = inputStream.read(bytes)) >= 0) {
                        zipOutputStream.write(bytes, 0, length);
                    }
                }
                response.setContentLength((int) (zipEntry != null ? zipEntry.getSize() : 0));
            } catch (IOException e) {
                System.err.println(e);
            } finally {
                if (inputStream != null) {
                    inputStream.close();
                }
                zipOutputStream.close();
            }

        };

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=project.zip");
        response.addHeader("Pragma", "no-cache");
        response.addHeader("Expires", "0");

        return ResponseEntity.ok(streamResponseBody);
    }


    /**
     * HTTP endpoint for uploading a file.
     *
     * @param file      the uploaded file
     * @param uuid      the UUID associated with the file
     * @param firstName the first name of the student
     * @param lastName  the last name of the student
     * @return a ResponseEntity
     */
    @PostMapping("/")
    public ResponseEntity<String> handleFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uuid") String uuid,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName) {
        String originalFilename = file.getOriginalFilename();
        assert originalFilename != null;
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);

        if (!extensions.contains(extension)) {
            return ResponseEntity.badRequest().body("Unsupported file type !");
        }

        Assessment assessment = assessmentRepository.findByUuid(uuid).orElseThrow();
        String path = String.valueOf(storageService.store(file, uuid, firstName + "_" + lastName));

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
     *
     * @param exc the exception thrown when a file is not found
     * @return a ResponseEntity with a 404 Not Found status
     */
    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
