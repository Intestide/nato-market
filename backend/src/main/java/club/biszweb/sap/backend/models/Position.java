package club.biszweb.sap.backend.models;

import club.biszweb.sap.backend.models.User;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Position {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "share_id", nullable = false)
  private Share share;

  private int quantity;

  @ManyToOne(optional = false, fetch = FetchType.EAGER)
  @JoinColumn(name = "owner_id", nullable = false)
  private User owner;

  private double initialPrice;

  public Position() {}

  public Position(Share share, int quantity, User owner) {
    this.share = share;
    this.quantity = quantity;
    this.owner = owner;
    this.initialPrice = share.getPrice();
  }

  public long getId() {
    return id;
  }

  public Share getShare() {
    return share;
  }

  public int getQuantity() {
    return quantity;
  }

  public User getOwner() {
    return owner;
  }

  public double getPrice() {
    return share.getPrice() * quantity;
  }

  public double getInitialPrice() {
    return initialPrice;
  }

  public void setId(long id) {
    this.id = id;
  }

  public void setShare(Share share) {
    this.share = share;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public void setOwner(User owner) {
    this.owner = owner;
  }


}
