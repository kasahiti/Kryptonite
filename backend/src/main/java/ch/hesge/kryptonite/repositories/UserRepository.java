package ch.hesge.kryptonite.repositories;

import java.util.Optional;

import ch.hesge.kryptonite.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByEmail(String email);

}
