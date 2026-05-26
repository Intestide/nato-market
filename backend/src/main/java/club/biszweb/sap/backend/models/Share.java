
package club.biszweb.sap.backend.models;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class Share{

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private double price;
  private String name;


  @ManyToOne
  @JoinColumn(name = "market_id")
  @JsonIgnore
  private Market market;

  public Share() {}

  public Share(String name, double price, Market market){
    this.name = name;
    this.price = price;
    this.market = market;
  }


  public String getName() {return name;}

  public double getPrice() {return price;}

  public long getId() {return id;}

  public Market getMarket() {return market;}

  public void setName(String name) {this.name = name;}

  public void setPrice(double price) {this.price = price;}

  public void setMarket(Market market) {this.market = market;}
  
}