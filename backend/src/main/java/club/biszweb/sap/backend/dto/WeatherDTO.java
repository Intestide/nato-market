package club.biszweb.sap.backend.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public record WeatherDTO(
    @JsonProperty("daily_units") WeatherDTO.Units dailyUnits,
    @JsonProperty("daily") WeatherDTO.Daily daily,
    @JsonProperty("current") WeatherDTO.Current current
) {
    public static record Units(
        @JsonProperty("temperature_2m_max") String temperatureMaxUnit
    ) {}

    public static record Current(
        List<String> time,
        @JsonProperty("temperature_2m") double temperature2m
    ) {}
    public static record Daily(
        List<String> time,
        @JsonProperty("temperature_2m_max") List<Double> temperature2mMax,
        @JsonProperty("temperature_2m_min") List<Double> temperature2mMin
    ) {}
}
