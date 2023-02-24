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

@Service
@RequiredArgsConstructor
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    public void register(String name, String language, MultipartFile file, User tmp) throws IOException {
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
    }
}
