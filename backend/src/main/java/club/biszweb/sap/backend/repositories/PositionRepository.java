package club.biszweb.sap.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import club.biszweb.sap.backend.models.Position;
import club.biszweb.sap.backend.models.Share;
import club.biszweb.sap.backend.models.User;

public interface PositionRepository extends JpaRepository<Position, Long> {
    Optional<Position> findByOwnerAndShare(User owner, Share share);
}
