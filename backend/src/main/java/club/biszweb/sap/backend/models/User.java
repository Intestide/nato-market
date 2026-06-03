package club.biszweb.sap.backend.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String username;
  private String password;
  private String email;

  @Enumerated(EnumType.STRING)
  private Role role;

  private double balance;

  @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Position> positions = new ArrayList<>();

  private boolean enabled = true;

  @ManyToOne
  @JoinColumn(name = "invitation_key_id")
  private InvitationKey invitationKey;

  public User() {
  }

  public User(String username, String password, String email, Role role) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.balance = 0.0;
  }

  // Getters and setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setBalance(double balance) {
    this.balance = balance;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public double getBalance() {
    return balance;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public InvitationKey getInvitationKey() {
    return invitationKey;
  }

  public void setInvitationKey(InvitationKey invitationKey) {
    this.invitationKey = invitationKey;
  }

  public List<Position> getPositions() {
    return positions;
  }

  public void setPositions(List<Position> positions) {
    this.positions = positions != null ? positions : new ArrayList<>();
  }

  public void addPosition(Position pos) {
    if (positions == null) {
      positions = new ArrayList<>();
    }
    positions.add(pos);
    pos.setOwner(this);
  }

  public void sellPosition(Position pos) {
    if (positions != null) {
      positions.remove(pos);
    }
  }
}
