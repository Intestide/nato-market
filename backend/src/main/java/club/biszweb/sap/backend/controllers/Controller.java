package club.biszweb.sap.backend.controllers;

import java.security.Principal;
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
import club.biszweb.sap.backend.repositories.UserRepository;
import club.biszweb.sap.backend.services.MarketService;
import club.biszweb.sap.backend.services.WeatherService;
import club.biszweb.sap.backend.dto.MarketDTO;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
public class Controller {

  @Autowired
  private MarketService marketService;

  @Autowired
  private WeatherService weatherService;

  @Autowired
  private MarketRepository repository;

  @Autowired
  private UserRepository userRepository;

  @GetMapping("/test")
  public int thing() {
    return weatherService.getPredictionTemp();
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
  @PostMapping("/trade")
  public ResponseEntity<String> trade(@RequestBody Map<String, Object> request, Principal principal) {
    if (principal == null) {
      return ResponseEntity.status(401).body("Not authenticated");
    }
    var user = userRepository.findByUsername(principal.getName()).orElse(null);
    if (user == null) {
      return ResponseEntity.status(401).body("User not found");
    }
    Long userId = user.getId();
    boolean tradeMode = (boolean) request.get("tradeMode");
    Long marketId = ((Number) request.get("marketId")).longValue();
    List<Map<String, Object>> trades = (List<Map<String, Object>>) request.get("trades");
    try {
      for (Map<String, Object> trade : trades) {
        Long shareId = ((Number) trade.get("shareId")).longValue();
        int quantity = ((Number) trade.get("quantity")).intValue();
        if (tradeMode) {
          marketService.buyShares(userId, marketId, shareId, quantity);
        } else  {
          marketService.sellShares(userId, marketId, shareId, quantity);
        }
      }
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
    return ResponseEntity.ok("Traded successfully. ");
  }
  //debug set balance - only for authenticated user's own account
  @PostMapping("/wow")
  public ResponseEntity<String> setBalance(@RequestBody Map<String, Object> request, Principal principal) {
      if (principal == null) {
          return ResponseEntity.status(401).body("Not authenticated");
      }
      var user = userRepository.findByUsername(principal.getName()).orElse(null);
      if (user == null) {
          return ResponseEntity.status(401).body("User not found");
      }
      int balance = ((Number) request.get("balance")).intValue();
      user.setBalance(balance);
      userRepository.save(user);
      return ResponseEntity.ok("rich.");
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
  public ResponseEntity<String> clearDatabase(Principal principal) {
    // Only allow authenticated admins to clear the database
    if (principal == null) {
      return ResponseEntity.status(401).body("Not authenticated");
    }
    var user = userRepository.findByUsername(principal.getName()).orElse(null);
    if (user == null || !user.getRole().toString().equals("ADMIN")) {
      return ResponseEntity.status(403).body("Admin access required");
    }
    repository.deleteAll();
    return ResponseEntity.ok("dead.");
  }
}
