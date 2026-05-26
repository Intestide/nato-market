package club.biszweb.sap.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import club.biszweb.sap.backend.models.Role;
import club.biszweb.sap.backend.models.User;
import club.biszweb.sap.backend.repositories.MarketRepository;
import club.biszweb.sap.backend.repositories.UserRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(MarketRepository repository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return (args) -> {

			if (userRepository.findByUsername("user").isEmpty()) {
				User defaultUser = new User("user", passwordEncoder.encode("password"), "user@example.com", Role.USER);
				userRepository.save(defaultUser);
			}
		};
	}
}
