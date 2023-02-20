package ch.hesge.kryptonite.config;

import ch.hesge.kryptonite.domain.Role;
import ch.hesge.kryptonite.payload.request.RegisterRequest;
import ch.hesge.kryptonite.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final AuthenticationService service;
    @Value("${kryptonite.user}")
    private String defaultUsername;
    @Value("${kryptonite.password}")
    private String defaultPassword;

    @EventListener(ApplicationReadyEvent.class)
    public void loadData() {
        service.register(new RegisterRequest(null, null, defaultUsername, defaultPassword), Role.ROLE_ADMIN);
    }
}
