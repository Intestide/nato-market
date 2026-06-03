package club.biszweb.sap.backend.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "market_type")
@DiscriminatorValue("BASE")
public class Market implements Resolver {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  protected String title;

  @ElementCollection(fetch = FetchType.EAGER)
  private List<String> tags = new ArrayList<>();

  private boolean resolved = false;

  @OneToMany(mappedBy = "market", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  protected List<Share> shares = new ArrayList<>();

  public Market() {}

  public Market(String title, double share1, double share2) {
    this.title = title;
    this.shares = new ArrayList<>();
    this.shares.add(new Share("yes", share1, this));
    this.shares.add(new Share("no", share2, this));
  }

  public Market(String title, List<Share> shares) {
    this.title = title;
    setShares(shares);
  }

  public void setId(long id) {
    this.id = id;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setTags(List<String> tags) {
    this.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
  }

  public void setShares(List<Share> shares) {
    this.shares = shares != null ? new ArrayList<>(shares) : new ArrayList<>();
    this.shares.forEach(share -> share.setMarket(this));
  }

  public void addShare(Share share) {
    if (share == null) {
      return;
    }
    if (shares == null) {
      shares = new ArrayList<>();
    }
    share.setMarket(this);
    shares.add(share);
  }

  public long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public List<String> getTags() {
    return tags;
  }

  public List<Share> getShares() {
    return shares;
  }

  public Share findShare(long shareId) {
    if (shares == null || shares.isEmpty()) {
      throw new RuntimeException("No shares available for market " + id);
    }
    return shares.stream()
        .filter(current -> current.getId() == shareId)
        .findFirst()
        .orElseThrow(() -> new RuntimeException("No share with id " + shareId + " found in market " + id));
  }

  @Override
  public boolean isResolved() {
    return resolved;
  }

  @Override
  public void setResolve(boolean resolution) {
    this.resolved = resolution;
  }
}
