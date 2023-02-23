package ch.hesge.kryptonite.payload.request;

import ch.hesge.kryptonite.domain.Language;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentRequest {
    private String name;
    private Language language;
    private String correction;
}
