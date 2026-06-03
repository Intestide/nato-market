package club.biszweb.sap.backend.services;

import java.time.LocalDateTime;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import club.biszweb.sap.backend.models.Market;
import club.biszweb.sap.backend.models.Position;
import club.biszweb.sap.backend.models.Share;
import club.biszweb.sap.backend.models.User;
import club.biszweb.sap.backend.repositories.MarketRepository;
import club.biszweb.sap.backend.repositories.PositionRepository;
import club.biszweb.sap.backend.repositories.UserRepository;

@Service
@Transactional
public class MarketService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private MarketRepository marketRepository;

  @Autowired
  private PositionRepository positionRepository;

  public void buyShares(Long userId, long marketId, long shareId, int quantity) {
    if (quantity <= 0) {
      throw new IllegalArgumentException("Quantity must be positive");
    }

    Market market = marketRepository.findById(marketId)
        .orElseThrow(() -> new RuntimeException("Market not found"));
    Share share = market.findShare(shareId);
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (market.isResolved()) {
      throw new RuntimeException("Market is resolved");
    }

    double cost = share.getPrice() * quantity;
    if (cost > user.getBalance()) {
      throw new RuntimeException("Not enough balance");
    }

    Position position = new Position(share, quantity, user);
    positionRepository.save(position);
    user.addPosition(position);
    user.setBalance(user.getBalance() - cost);
    userRepository.save(user);
  }

  public void sellShares(Long userId, long marketId, long shareId, int quantity) {
    if (quantity <= 0) {
      throw new IllegalArgumentException("Quantity must be positive");
    }

    Market market = marketRepository.findById(marketId)
        .orElseThrow(() -> new RuntimeException("Market not found"));
    Share share = market.findShare(shareId);
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Position position = positionRepository.findByOwnerAndShare(user, share)
        .orElseThrow(() -> new RuntimeException("No position found for this share"));

    if (quantity > position.getQuantity()) {
      throw new RuntimeException("Not enough shares owned");
    }

    double revenue = share.getPrice() * quantity;
    if (quantity == position.getQuantity()) {
      user.sellPosition(position);
      positionRepository.delete(position);
    } else {
      position.setQuantity(position.getQuantity() - quantity);
      positionRepository.save(position);
    }

    user.setBalance(user.getBalance() + revenue);
    userRepository.save(user);
  }

  public void resolveMarket(Long marketId, int winningShareIndex) {
    Market market = marketRepository.findById(marketId)
        .orElseThrow(() -> new RuntimeException("Market not found"));
    if (market.isResolved()) {
      throw new RuntimeException("Market is already resolved");
    }

    if (winningShareIndex < 0 || winningShareIndex >= market.getShares().size()) {
      throw new IllegalArgumentException("Winning share index is out of range");
    }

    for (int i = 0; i < market.getShares().size(); i++) {
      Share share = market.getShares().get(i);
      share.setPrice(i == winningShareIndex ? 1 : 0);
    }

    positionRepository.findAll().stream()
        .filter(position -> position.getShare().getMarket().getId() == marketId)
        .forEach(position -> {
          User owner = position.getOwner();
          if (position.getShare().getPrice() > 0) {
            owner.setBalance(owner.getBalance() + position.getPrice());
          }
          owner.sellPosition(position);
          positionRepository.delete(position);
          userRepository.save(owner);
        });

    market.setResolve(true);
    marketRepository.save(market);
  }
}
