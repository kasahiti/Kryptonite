package ch.hesge.kryptonite.services;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.Language;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.repositories.UserRepository;
import ch.hesge.kryptonite.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * Spring service that provides a method for registering a new assessment.
 */
@Service
@RequiredArgsConstructor
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    /**
     * Creates new assessment entity. This method also creates a directory for the assessment's check50 data and
     * stores the correction in that directory.
     *
     * @param name     The name of the assessment.
     * @param language The language of the assessment.
     * @param file     A File containing the correction string for the assessment.
     * @param tmp      A User representing the user who is registering the assessment.
     * @throws IOException If an I/O error occurs.
     */
    public String register(String name, String language, MultipartFile file, User tmp) throws IOException {
        var user = userRepository.findByEmail(tmp.getEmail()).orElseThrow();
        var uuid = String.valueOf(UUID.randomUUID());
        var correction = new String(file.getBytes());
        String path = String.valueOf(storageService.createCheck50Dir(uuid, correction));

        var assessment = Assessment.builder()
                .name(name)
                .language(Language.valueOf(language))
                .user(user)
                .uuid(uuid)
                .correction(correction)
                .check50DataPath(path)
                .build();

        assessmentRepository.save(assessment);

        return uuid;
    }


    /**
     * Modifies an existing assessment's correction
     *
     * @param assessment the Assessment entity to modify
     * @param file       a MultipartFile containing the new correction string for the assessment
     * @throws Exception if an error occurs while modifying the assessment's correction
     */
    public void modify(Assessment assessment, MultipartFile file) throws Exception {
        var correction = new String(file.getBytes());
        storageService.createCheck50Dir(assessment.getUuid(), correction);
        assessment.setCorrection(correction);
    }
}
