package ch.hesge.kryptonite.payload.response;

import ch.hesge.kryptonite.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Java class used to represent an autentication response (JWT token more specifically).
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Integer id;
}
