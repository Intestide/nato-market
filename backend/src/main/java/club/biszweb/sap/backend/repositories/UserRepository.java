package club.biszweb.sap.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import club.biszweb.sap.backend.models.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}