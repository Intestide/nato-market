package club.biszweb.sap.backend.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
  public String thing() {return "Hello World!";}

  @GetMapping
  public List<Market> getAllMarkets() {
    return repository.findAll();
  }

  
  @GetMapping("/{id}")
  public Market getMarketById(@PathVariable Long id) {
    return repository.findById(id).orElse(null);
  }
}
