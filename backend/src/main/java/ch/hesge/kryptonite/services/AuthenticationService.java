package ch.hesge.kryptonite.services;

import ch.hesge.kryptonite.domain.Role;
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
     * @param role    The user's role
     * @return An AuthenticationResponse containing the JWT token.
     */
    public AuthenticationResponse register(RegisterRequest request, Role role) {
        var user = User.builder()
                .firstname(request.getFirstName())
                .lastname(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .firstName(user.getFirstname())
                .lastName(user.getLastname())
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
                .firstName(user.getFirstname())
                .lastName(user.getLastname())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthenticationResponse authenticate(User user) {
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .firstName(user.getFirstname())
                .lastName(user.getLastname())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
