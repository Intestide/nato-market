package club.biszweb.sap.backend.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import club.biszweb.sap.backend.services.MarketService;
import club.biszweb.sap.backend.dto.MarketDTO;

@RestController
@RequestMapping("/api")
public class Controller {

  MarketService marketService = new MarketService();

  @Autowired
  private MarketRepository repository;

  @GetMapping("/markets/test")
  public String thing() {
    return "Hello World!";
  }

  @GetMapping("/markets")
  public List<MarketDTO> getAllMarkets() {
    return repository.findAll().stream().map(MarketDTO::from).collect(Collectors.toList());
  }

  @GetMapping("/markets/{id}")
  public ResponseEntity<MarketDTO> getMarketById(@PathVariable Long id) {
    return repository.findById(id)
        .map(market -> ResponseEntity.ok(MarketDTO.from(market)))
        .orElseGet(() -> ResponseEntity.notFound().build());
  }


  @PostMapping("/addMarket")
  public MarketDTO addMarket(@RequestBody Market newMarket) {
    if (newMarket.getShares() != null) {
        newMarket.getShares().forEach(share -> share.setMarket(newMarket));
    }
    Market saved = repository.save(newMarket);
    return MarketDTO.from(saved);
  }
  
  @PostMapping("/generateMarket")
  public ResponseEntity addSystemMarket() {
    Market automaticMarket = marketService.generateMarket();
    repository.save(automaticMarket);
    return ResponseEntity.ok("added.");
  }

  @PostMapping("/markets/{id}/tags")
  public ResponseEntity<MarketDTO> addTag(@PathVariable Long id, @RequestBody Map<String, String> body) {
    String tag = body.get("tag");
    if (tag == null || tag.isBlank()) {
      return ResponseEntity.badRequest().build();
    }
    return repository.findById(id).map(market -> {
      if (market.getTags() == null) {
        market.setTags(new java.util.ArrayList<>());
      }
      java.util.List<String> tags = market.getTags();
      tags.add(tag);
      market.setTags(tags);
      Market saved = repository.save(market);
      return ResponseEntity.ok(MarketDTO.from(saved));
    }).orElseGet(() -> ResponseEntity.notFound().build());
  }
  
  @DeleteMapping("/markets/all")
  public ResponseEntity<String> clearDatabase() {
    repository.deleteAll();
    return ResponseEntity.ok("dead.");
  }
}
