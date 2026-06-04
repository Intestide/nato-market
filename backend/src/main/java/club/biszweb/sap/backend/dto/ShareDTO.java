package club.biszweb.sap.backend.dto;

import club.biszweb.sap.backend.models.Share;

public class ShareDTO {
  private long id;
  private String name;
  private double price;

  public ShareDTO() {}

  public ShareDTO(long id, String name, double price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  public static ShareDTO from(Share s) {
    return new ShareDTO(s.getId(), s.getName(), s.getPrice());
  }

  public long getId() { return id; }
  public String getName() { return name; }
  public double getPrice() { return price; }
}
