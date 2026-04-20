package club.biszweb.sap.backend;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
   @GetMapping("/api")
    public String thing() {
        return "Hello World!";
    }
}
