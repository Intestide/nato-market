package club.biszweb.sap.backend.services;

import java.util.UUID;
import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import club.biszweb.sap.backend.models.InvitationKey;
import club.biszweb.sap.backend.models.User;
import club.biszweb.sap.backend.repositories.InvitationKeyRepository;

@Service
public class InvitationKeyService {

    @Autowired
    private InvitationKeyRepository invitationKeyRepository;

    /**
     * Generate a new invitation key
     */
    public InvitationKey generateKey(User createdBy) {
        String keyCode = UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        InvitationKey key = new InvitationKey(keyCode, createdBy);
        return invitationKeyRepository.save(key);
    }

    /**
     * Generate a key for a referral (when a user generates a key to share with others)
     */
    public InvitationKey generateReferralKey(User referredBy) {
        String keyCode = UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        InvitationKey key = new InvitationKey(keyCode, referredBy); // referredBy is both creator and referrer
        key.setReferredBy(referredBy);
        return invitationKeyRepository.save(key);
    }

    /**
     * Validate and use an invitation key
     */
    public boolean validateAndUseKey(String keyCode, User user) {
        Optional<InvitationKey> keyOptional = invitationKeyRepository.findByKeyCode(keyCode);

        if (keyOptional.isEmpty()) {
            return false;
        }

        InvitationKey key = keyOptional.get();

        // Check if key is active and not already used
        if (!key.isActive()) {
            return false;
        }

        // Use the key
        key.addUsedBy(user);
        key.setLastUsedAt(java.time.LocalDateTime.now());
        invitationKeyRepository.save(key);

        return true;
    }

    /**
     * Get a key by its code
     */
    public Optional<InvitationKey> getKeyByCode(String keyCode) {
        return invitationKeyRepository.findByKeyCode(keyCode);
    }

    /**
     * Check if a key is valid and available for use
     */
    public boolean isKeyValid(String keyCode) {
        Optional<InvitationKey> keyOptional = invitationKeyRepository.findByKeyCode(keyCode);
        if (keyOptional.isEmpty()) {
            return false;
        }

        InvitationKey key = keyOptional.get();
        return key.isActive();
    }

    /**
     * Get all active keys
     */
    public List<InvitationKey> getAllActiveKeys() {
        return invitationKeyRepository.findByIsActiveTrue();
    }

    /**
     * Get all keys created by an admin
     */
    public List<InvitationKey> getKeysByCreator(User creator) {
        return invitationKeyRepository.findByCreatedBy(creator);
    }

    /**
     * Get all referral keys from a user
     */
    public List<InvitationKey> getReferralKeysByUser(User user) {
        return invitationKeyRepository.findByReferredBy(user);
    }

    /**
     * Deactivate a key
     */
    public void deactivateKey(Long keyId) {
        Optional<InvitationKey> keyOptional = invitationKeyRepository.findById(keyId);
        if (keyOptional.isPresent()) {
            InvitationKey key = keyOptional.get();
            key.setActive(false);
            invitationKeyRepository.save(key);
        }
    }
}
