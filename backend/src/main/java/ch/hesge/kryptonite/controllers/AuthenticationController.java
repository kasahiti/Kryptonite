package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.payload.request.AuthenticationRequest;
import ch.hesge.kryptonite.payload.request.RegisterRequest;
import ch.hesge.kryptonite.payload.response.AuthenticationResponse;
import ch.hesge.kryptonite.repositories.UserRepository;
import ch.hesge.kryptonite.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller that handles HTTP requests for user authentication and registration.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;


    /**
     * HTTP endpoint for registering a new user.
     *
     * @param request the RegisterRequest
     * @return a ResponseEntity
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        return ResponseEntity.ok(service.register(request));
    }


    /**
     * HTTP endpoint for authenticating a user.
     *
     * @param request the AuthenticationRequest
     * @return a ResponseEntity
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
