package club.biszweb.sap.backend.dto;

import club.biszweb.sap.backend.models.Market;

import java.util.List;
import java.util.stream.Collectors;

public class MarketDTO {
  private long id;
  private String title;
  private List<String> tags;
  private List<ShareDTO> shares;
  private boolean resolved;

  public MarketDTO() {}

  public MarketDTO(long id, String title, List<String> tags, List<ShareDTO> shares, boolean resolved) {
    this.id = id;
    this.title = title;
    this.tags = tags;
    this.shares = shares;
    this.resolved = resolved;
  }

  public static MarketDTO from(Market m) {
    List<ShareDTO> s = m.getShares() == null ? List.of() : m.getShares().stream().map(ShareDTO::from).collect(Collectors.toList());
    return new MarketDTO(m.getId(), m.getTitle(), m.getTags(), s, m.isResolved());
  }

  public long getId() { return id; }
  public String getTitle() { return title; }
  public List<String> getTags() { return tags; }
  public List<ShareDTO> getShares() { return shares; }
  public boolean isResolved() { return resolved; }
}
