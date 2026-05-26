package club.biszweb.sap.backend.models;

public class Position {
  private long id;
  private Share share;
  private int quantity;
  private User owner;
  private double totalPrice;

  public Position() {}

  public Position(Share share, int quantity, User owner) {
    this.share = share;
    this.quantity = quantity;
    this.owner = owner;
    this.totalPrice = share.getPrice() * quantity;
  }

  public long getId() { return id; }
  public Share getShare() { return share; }
  public int getQuantity() { return quantity; }
  public User getOwner() { return owner; }
  public double getPrice() { return totalPrice; }
  public void setId(long id) { this.id = id; }
  public void setShare(Share share) { this.share = share; }
  public void setQuantity(int quantity) { this.quantity = quantity; }
  public void setOwner(User owner) { this.owner = owner; }
  public void setPrice(double totalPrice) { this.totalPrice = totalPrice; }  
}
