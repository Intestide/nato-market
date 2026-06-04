package club.biszweb.sap.backend.dto;



import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public record WeatherDTO(
    @JsonProperty("daily_units") DailyUnits dailyUnits,
    @JsonProperty("daily") DailyData daily
) {}

 public record DailyUnits(
    @JsonProperty("temperature_2m_max") String temperatureMaxUnit
) {}

 public record DailyData(
    List<String> time,
    @JsonProperty("temperature_2m_max") List<Double> temperature2mMax,
    @JsonProperty("temperature_2m_min") List<Double> temperature2mMin
) {}