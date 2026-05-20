package club.biszweb.sap.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
public class InvitationKey {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String keyCode;

    @ManyToOne
    private User createdBy; // Admin who created the key

    @ManyToOne
    private ArrayList<User> usedBy=new ArrayList<>(); // User who used this key to sign up

    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;

    @Column(nullable = false)
    private boolean isActive = true;

    @ManyToOne
    private User referredBy;

    public InvitationKey() {}

    public InvitationKey(String keyCode, User createdBy) {
        this.keyCode = keyCode;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getKeyCode() { return keyCode; }
    public void setKeyCode(String keyCode) { this.keyCode = keyCode; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public ArrayList<User> getUsedBy() { return usedBy; }
    public void addUsedBy(User user) { this.usedBy.add(user); }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(LocalDateTime lastUsedAt) { this.lastUsedAt = lastUsedAt; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public User getReferredBy() { return referredBy; }
    public void setReferredBy(User referredBy) { this.referredBy = referredBy; }

    public boolean isUsed() {
      return usedBy != null && !usedBy.isEmpty();
    }
}
