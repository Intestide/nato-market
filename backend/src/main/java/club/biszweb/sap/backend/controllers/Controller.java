package club.biszweb.sap.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import club.biszweb.sap.backend.models.Market;
import club.biszweb.sap.backend.repositories.MarketRepository;

@RestController
@RequestMapping("/api/markets")
public class Controller {

  @Autowired
  private MarketRepository repository;

  @GetMapping("/test")
  public String thing() {
    return "Hello World!";
  }

  @GetMapping
  public List<Market> getAllMarkets() {
    return repository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Market> getMarketById(@PathVariable Long id) {
    return repository.findById(id)
        .map(market -> ResponseEntity.ok(market))
        .orElseGet(() -> ResponseEntity.notFound().build());
  }


  @PostMapping("/add")
  public Market addMarket(@RequestBody Market newMarket) {
    if (newMarket.getShares() != null) {
        newMarket.getShares().forEach(share -> share.setMarket(newMarket));
    }
    return repository.save(newMarket);
  }

  @DeleteMapping("/all")
  public ResponseEntity<String> clearDatabase() {
    repository.deleteAll();
    return ResponseEntity.ok("dead.");
  }
}
