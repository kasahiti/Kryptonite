package ch.hesge.kryptonite.services;

import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.payload.request.AuthenticationRequest;
import ch.hesge.kryptonite.payload.request.RegisterRequest;
import ch.hesge.kryptonite.payload.response.AuthenticationResponse;
import ch.hesge.kryptonite.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


/**
 * Spring service that provides methods for user registration and authentication.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Creates and saves a new User to the repository. It also generates a new JWT token using the JwtService.
     *
     * @param request The registration request containing the user's information.
     * @return An AuthenticationResponse containing the JWT token.
     */
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        repository.save(user);
        return AuthenticationResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Authenticates the user using the email and password from the AuthenticationRequest, and generates a new JWT
     * token using the JwtService if the authentication is successful.
     *
     * @param request The authentication request containing the user's email and password.
     * @return An AuthenticationResponse containing a JWT token.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .id(user.getId())
                .build();
    }


    /**
     * Generates a JWT token for the given User and returns an AuthenticationResponse containing the token and the user's information.
     *
     * @param user the User to generate a token for
     * @return an AuthenticationResponse containing the JWT token and the user's information
     */
    public AuthenticationResponse authenticate(User user) {
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
