package club.biszweb.sap.backend;
import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;


@Entity
public class Market {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;
  private String title;
  // private String[] tags;

  public long getId() {return id;}
  public String getTitle() {return title;}
  // public String[] getTags() 

}