package club.biszweb.sap.backend.services;

import club.biszweb.sap.backend.dto.WeatherDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WeatherService {

	private final RestTemplate restTemplate = new RestTemplate();

	public int getPredictionTemp() {
		String uri = UriComponentsBuilder.fromUriString("https://api.open-meteo.com/v1/forecast")
				.queryParam("latitude", 22.5431)
				.queryParam("longitude", 114.0579)
				.queryParam("daily", "temperature_2m_max,temperature_2m_min")
				.queryParam("forecast_days", 2)
				.queryParam("timezone", "Asia/Singapore")
				.toUriString();

		WeatherDTO response = restTemplate.getForObject(uri, WeatherDTO.class);

		if (response != null && response.daily().time().size() >= 2) {
			Double maxTemp = response.daily().temperature2mMax().get(1);
			Double minTemp = response.daily().temperature2mMin().get(1);

			if (maxTemp != null && minTemp != null) {
				return (int) Math.round((maxTemp + minTemp) / 2);
			}
		}

		return -1;
	}


	//new
	public double getActual() {
		String uri = UriComponentsBuilder.fromUriString("https://api.open-meteo.com/v1/forecast")
				.queryParam("latitude", 22.5431)
				.queryParam("longitude", 114.0579)
				.queryParam("daily", "temperature_2m_max,temperature_2m_min")
				.queryParam("forecast_days", 0)
				.queryParam("timezone", "Asia/Singapore")
				.toUriString();

		WeatherDTO response = restTemplate.getForObject(uri, WeatherDTO.class);
		return response.current().temperature2m();
	}
}
