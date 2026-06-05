package club.biszweb.sap.backend.models;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import club.biszweb.sap.backend.services.MarketService;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


//new
@Entity
@DiscriminatorValue("CRYPTO")
public class CryptoMarket extends DailyMarket {

  private LocalDate targetDate;
  private double targetPrice;

  @Autowired
  MarketService marketService;

  public CryptoMarket() {
    super();
  }

  public CryptoMarket(String currencyName,LocalDate targetDate, double targetPrice) {
    this.title = "price of " + currencyName + " on " + targetDate.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG));
    this.targetDate = targetDate;
    this.targetPrice = targetPrice;
    this.tags = List.of("crypto", "daily", "economy");
      List<Share> initShares = new ArrayList<>();
    initShares.add(new Share(">" + targetPrice, 0.5, this));
    initShares.add(new Share("<" + targetPrice, 0.5, this));
    setShares(initShares);
  }


  public double getTargetPrice() {
    return targetPrice;
  }

  public void setTargetPrice(double targetPrice) {
    this.targetPrice = targetPrice;
  }

  @Override
  void selfResolve(LocalDate current) {
    // empty for now
    
  }
}
