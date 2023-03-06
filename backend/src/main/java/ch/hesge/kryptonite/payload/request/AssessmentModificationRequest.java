package ch.hesge.kryptonite.payload.request;


import ch.hesge.kryptonite.domain.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Java class used to represent an assessment modification request from a user.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentModificationRequest {
    private String correction;
    private String name;
    private Language language;
}
