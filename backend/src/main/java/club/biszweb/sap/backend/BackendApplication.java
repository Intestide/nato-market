package club.biszweb.sap.backend;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import club.biszweb.sap.backend.models.Market;
import club.biszweb.sap.backend.models.Share;
import club.biszweb.sap.backend.models.User;
import club.biszweb.sap.backend.repositories.MarketRepository;
import club.biszweb.sap.backend.repositories.UserRepository;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(MarketRepository repository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return (args) -> {
			// Seed default user if not exists
			if (userRepository.findByUsername("user").isEmpty()) {
				User defaultUser = new User("user", passwordEncoder.encode("password"), "USER");
				userRepository.save(defaultUser);
			}

			// repository.save(new Market("question", 0.2,0.8));
			// Market b = new Market();
			// b.setTitle("question 2");
			// b.setTags(List.of("fucker", "gay"));
			// b.setShare(List.of(new Share("one", 0.2, b), new Share("two", 0.2,b), new Share("three", 0.6, b)));
			
			// repository.save(b);


			// // fetch all customers
			// System.out.println("findAll(): ");
			// System.out.println("-------------------------------");
			// repository.findAll().forEach(e -> {
			// 	System.out.println(e.toString());
			// });
			// System.out.println("");

		};
	}
}
