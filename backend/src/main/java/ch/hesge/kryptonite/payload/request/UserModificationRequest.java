package ch.hesge.kryptonite.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Java class used to represent a user modification request from a user.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserModificationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String newEmail;
    private String password;
}
