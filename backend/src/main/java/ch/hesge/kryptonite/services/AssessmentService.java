package ch.hesge.kryptonite.services;

import ch.hesge.kryptonite.domain.Assessment;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.payload.request.AssessmentRequest;
import ch.hesge.kryptonite.repositories.AssessmentRepository;
import ch.hesge.kryptonite.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;

    public void register(AssessmentRequest request, User tmp) {
        var user = userRepository.findByEmail(tmp.getEmail()).orElseThrow();
        System.out.println(request);
        var assessment = Assessment.builder()
                .name(request.getName())
                .language(request.getLanguage())
                .user(user)
                .uuid(String.valueOf(UUID.randomUUID()))
                .build();

        assessmentRepository.save(assessment);
    }
}
