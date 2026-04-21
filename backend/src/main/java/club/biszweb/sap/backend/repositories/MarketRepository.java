package club.biszweb.sap.backend.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import club.biszweb.sap.backend.models.Market;


public interface MarketRepository extends JpaRepository<Market, Long> {
    // You can add custom searches here later if needed
}