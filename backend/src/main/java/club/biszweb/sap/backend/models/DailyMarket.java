package club.biszweb.sap.backend.models;

import java.time.LocalDate;



//new
public abstract class DailyMarket extends Market{
  protected LocalDate targetDate;

  public DailyMarket(){
    super();
  }

  public LocalDate getTargetDate() {
    return targetDate;
  }

  public void setTargetDate(LocalDate targetDate) {
    this.targetDate = targetDate;
  }

  abstract void selfResolve(LocalDate current);
}
