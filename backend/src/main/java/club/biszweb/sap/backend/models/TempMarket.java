package club.biszweb.sap.backend.models;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TEMP")
public class TempMarket extends Market {

  private LocalDate targetDate;
  private int prediction;

  public TempMarket() {
    super();
  }

  public TempMarket(LocalDate targetDate, int prediction) {
    super();
    this.targetDate = targetDate;
    this.prediction = prediction;
    this.title = "temperature of " + targetDate.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG));
    this.tags = List.of("weather", "daily", "temperature");
    List<Share> tempShares = new ArrayList<>();
    tempShares.add(new Share("higher than " + prediction, 0.5, this));
    tempShares.add(new Share("lower than " + prediction, 0.5, this));
    setShares(tempShares);
  }

  public LocalDate getTargetDate() {
    return targetDate;
  }

  public void setTargetDate(LocalDate targetDate) {
    this.targetDate = targetDate;
  }

  public int getPrediction() {
    return prediction;
  }

  public void setPrediction(int prediction) {
    this.prediction = prediction;
  }
}
