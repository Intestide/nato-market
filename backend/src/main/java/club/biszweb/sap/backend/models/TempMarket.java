package club.biszweb.sap.backend.models;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import club.biszweb.sap.backend.services.MarketService;
import club.biszweb.sap.backend.services.WeatherService;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TEMP")
public class TempMarket extends DailyMarket {
  private int prediction;

  @Autowired
  WeatherService weatherService;

  @Autowired
  MarketService marketService;
  
  public TempMarket() {
    super();
  }

  public TempMarket(LocalDate targetDate, int prediction) {
    super();
    this.targetDate = targetDate;
    this.prediction = prediction;
    this.title = "temperature of " + targetDate.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG));
    this.tags = List.of("weather", "daily", "temperature");
    List<Share> initShares = new ArrayList<>();
    initShares.add(new Share(">" + prediction, 0.5, this));
    initShares.add(new Share("<" + prediction, 0.5, this));
    setShares(initShares);
  }

  public int getPrediction() {
    return prediction;
  }

  public void setPrediction(int prediction) {
    this.prediction = prediction;
  }


  //new
  @Override
  void selfResolve(LocalDate current) {
    // TODO Auto-generated method stub
    double actualTemp = weatherService.getActual(); // get from weather api
    if (actualTemp > prediction) {
      marketService.resolveMarket(this.getId(), shares.get(0).getId());
    } else {
      marketService.resolveMarket(this.getId(), shares.get(1).getId());
    }

  }
}
