package ch.hesge.kryptonite.controllers;

import ch.hesge.kryptonite.payload.request.AuthenticationRequest;
import ch.hesge.kryptonite.repositories.UserRepository;
import ch.hesge.kryptonite.services.AuthenticationService;
import ch.hesge.kryptonite.payload.request.RegisterRequest;
import ch.hesge.kryptonite.payload.response.AuthenticationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;

  private final UserRepository userRepository;

  @PostMapping("/register")
  public ResponseEntity register(@RequestBody RegisterRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      return ResponseEntity.badRequest().body("User already exists");
    }
    return ResponseEntity.ok(service.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(service.authenticate(request));
  }
}
