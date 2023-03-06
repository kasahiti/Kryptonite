package ch.hesge.kryptonite.controllers;


import ch.hesge.kryptonite.domain.Role;
import ch.hesge.kryptonite.domain.User;
import ch.hesge.kryptonite.payload.request.UserModificationRequest;
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
 * REST controller that handles HTTP requests for user.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationService service;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> modifyUser(@RequestBody UserModificationRequest request, @PathVariable Integer id) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User userToChange = userRepository.findById(id).orElseThrow();
        boolean same = loggedInUser.equals(userToChange);

        if (loggedInUser.getRole().equals(Role.ROLE_ADMIN) || loggedInUser.equals(userToChange)) {
            if(request.getFirstName() != null) userToChange.setFirstName(request.getFirstName());
            if(request.getLastName() != null) userToChange.setLastName(request.getLastName());
            if(request.getNewEmail() != null) userToChange.setEmail(request.getNewEmail());
            if(request.getPassword() != null) userToChange.setPassword(passwordEncoder.encode(request.getPassword()));
            if(request.getRole() != null) userToChange.setRole(request.getRole());
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

    /**
     * HTTP endpoint for fetching all users.
     *
     * @return a ResponseEntity
     */
    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> fetchAll() {
        List<User> users = userRepository.findAll();
        users.remove((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        return ResponseEntity.ok().body(users);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id){
        User user = userRepository.findById(id).orElseThrow();
        userRepository.delete(user);
        return ResponseEntity.ok().body("User deleted successfully!");
    }
}
