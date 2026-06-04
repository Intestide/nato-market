package club.biszweb.sap.backend.services;

import java.util.Optional;

import club.biszweb.sap.backend.dto.WeatherDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class   WeatherService {

	private final RestClient restClient;

	public WeatherService(RestClient.Builder restClientBuilder) {
		this.restClient = restClientBuilder.baseUrl("https://open-meteo.com").build();
	}

	public Optional<TomorrowTemperature> getTomorrowTemperatureRange() {
		String uri = UriComponentsBuilder.fromPath("/forecast")
				.queryParam("latitude", 22.5431)
				.queryParam("longitude", 114.0579)
				.queryParam("daily", "temperature_2m_max,temperature_2m_min")
				.queryParam("forecast_days", 2)
				.queryParam("timezone", "Asia/Singapore")
				.toUriString();

		WeatherDTO response = restClient.get()
				.uri(uri)
				.retrieve()
				.body(WeatherDTO.class);

		if (response != null && response.daily().time().size() >= 2) {
			Double maxTemp = response.daily().temperature2mMax().get(1);
			Double minTemp = response.daily().temperature2mMin().get(1);

			if (maxTemp != null && minTemp != null) {
				return Optional.of(new TomorrowTemperature(
					(int) Math.round(maxTemp),
					(int) Math.round(minTemp)));
			}
		}

		return Optional.empty();
	}

	public static record TomorrowTemperature(int maxTemp, int minTemp) {}
}
