package club.biszweb.sap.backend.controllers;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import club.biszweb.sap.backend.models.InvitationKey;
import club.biszweb.sap.backend.models.Role;
import club.biszweb.sap.backend.models.User;
import club.biszweb.sap.backend.repositories.UserRepository;
import club.biszweb.sap.backend.services.InvitationKeyService;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private InvitationKeyService invitationKeyService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping("/user")
    public ResponseEntity<Map<String, String>> user(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of("name", principal.getName()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));
            SecurityContextHolder.getContext().setAuthentication(auth);
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "username", username));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");
        String invitationKeyCode = request.get("invitationKey");

        if (username == null || password == null || email == null || invitationKeyCode == null) {
            return ResponseEntity.badRequest()
                    .body("Username, password, email, and invitation key are required");
        }

        if (!invitationKeyService.isKeyValid(invitationKeyCode)) {
            return ResponseEntity.badRequest()
                    .body("Invalid or already used invitation key");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User(username, passwordEncoder.encode(password), email, Role.USER);
        user.setEnabled(true);
        userRepository.save(user);

        // Mark invitation key as used
        invitationKeyService.validateAndUseKey(invitationKeyCode, user);

        return ResponseEntity.ok("Signup successful! You can now login.");
    }

    /**
     * Generate a new invitation key (admin only)
     */
    @PostMapping("/admin/generate-key")
    public ResponseEntity<?> generateKey(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User admin = userRepository.findByUsername(principal.getName()).orElse(null);
        if (admin == null || !admin.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(403).body("Only admins can generate keys");
        }

        InvitationKey key = invitationKeyService.generateKey(admin);
        return ResponseEntity.ok(Map.of(
                "keyCode", key.getKeyCode(),
                "id", key.getId(),
                "createdAt", key.getCreatedAt().toString()));
    }

    @PostMapping("/generate-referral-key")
    public ResponseEntity<?> generateReferralKey(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        InvitationKey key = invitationKeyService.generateReferralKey(user);
        return ResponseEntity.ok(Map.of(
                "keyCode", key.getKeyCode(),
                "id", key.getId(),
                "createdAt", key.getCreatedAt().toString()));
    }

    /**
     * Get all referral keys for the current user
     */
    @GetMapping("/my-referral-keys")
    public ResponseEntity<?> getMyReferralKeys(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        var keys = invitationKeyService.getReferralKeysByUser(user);
        return ResponseEntity.ok(keys);
    }
}
