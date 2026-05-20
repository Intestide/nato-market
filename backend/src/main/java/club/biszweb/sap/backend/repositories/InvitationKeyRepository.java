package club.biszweb.sap.backend.repositories;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import club.biszweb.sap.backend.models.InvitationKey;
import club.biszweb.sap.backend.models.User;

public interface InvitationKeyRepository extends JpaRepository<InvitationKey, Long> {
    Optional<InvitationKey> findByKeyCode(String keyCode);
    List<InvitationKey> findByIsActiveTrue();
    List<InvitationKey> findByCreatedBy(User createdBy);
    List<InvitationKey> findByUsedBy(User usedBy);
    List<InvitationKey> findByReferredBy(User referredBy);
}
