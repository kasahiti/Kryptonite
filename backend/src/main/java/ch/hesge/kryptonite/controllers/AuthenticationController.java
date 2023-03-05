package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.domain.Role;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.payload.request.AuthenticationRequest;
import ch.hesge.kryptonite.payload.request.RegisterRequest;
import ch.hesge.kryptonite.payload.request.UserModificationRequest;
import ch.hesge.kryptonite.payload.response.AuthenticationResponse;
import ch.hesge.kryptonite.repositories.UserRepository;
import ch.hesge.kryptonite.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * REST controller that handles HTTP requests for user authentication and registration.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


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
        return ResponseEntity.ok(service.register(request, Role.ROLE_USER));
    }

    /**
     * HTTP endpoint for fetching all users.
     *
     * @return a ResponseEntity
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> fetchAll() {
        List<User> users = userRepository.findAll();
        users.remove((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());

        return ResponseEntity.ok().body(users);
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

    @PostMapping("/modify")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> modifyUser(@RequestBody UserModificationRequest request) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User userToChange = userRepository.findByEmail(request.getEmail()).orElseThrow();
        boolean same = loggedInUser.equals(userToChange);

        if (loggedInUser.getRole().equals(Role.ROLE_ADMIN) || loggedInUser.equals(userToChange)) {
            if(request.getFirstName() != null) userToChange.setFirstName(request.getFirstName());
            if(request.getLastName() != null) userToChange.setLastName(request.getLastName());
            if(request.getNewEmail() != null) userToChange.setEmail(request.getNewEmail());
            if(request.getPassword() != null) userToChange.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(userToChange);
            if(same) {
                return ResponseEntity.ok().body(service.authenticate(userToChange));
            } else {
                return ResponseEntity.ok().body("User changed successfully!");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You don't have the rights to access this ressource");
        }
    }

    // delete..
}
