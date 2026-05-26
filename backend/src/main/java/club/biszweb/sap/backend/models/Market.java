package club.biszweb.sap.backend.models;
import jakarta.persistence.*;

import java.util.List;


@Entity
public class Market {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  private String title;

  private List<String> tags;

  @OneToMany(mappedBy = "market", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private List<Share> shares;

  public Market() {}

  public Market( String title, double share1, double share2){
    this.title = title;
    this.shares = List.of(new Share("yes", share1, this),new Share("no", share2, this));
  }

  public Market(String title, List<Share> shares){
    this.title = title;
    this.shares = shares;
  }
  public void setId(long id) {this.id = id;}
  


  public void setTitle(String title) {this.title = title;}

  public void setTags(List<String> tags) {this.tags = tags;}

  public void setShare(List<Share> shares) {this.shares = shares;}

  public long getId() {return id;}
  public String getTitle() {return title;}
  public List<String> getTags() {return tags;} 
  public List<Share> getShares() {return shares;}
}