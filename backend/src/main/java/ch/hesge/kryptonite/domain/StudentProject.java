package ch.hesge.kryptonite.domain;

import ch.hesge.kryptonite.jobs.JobStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Builder
@AllArgsConstructor
@Entity
@Table(name = "student_projects")
public class StudentProject {
    @Id
    @GeneratedValue
    private Long id;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    private String fileName;

    private String firstName;
    private String lastName;

    private JobStatus status;
    private String jsonResults;
}
