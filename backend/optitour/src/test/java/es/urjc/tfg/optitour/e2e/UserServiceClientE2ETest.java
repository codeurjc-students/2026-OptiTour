package es.urjc.tfg.optitour.e2e;

import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.urlToBe;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Duration;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;

@SpringBootTest
public class UserServiceClientE2ETest {
    protected WebDriver driver;

    @Autowired
    UserRepository repository;

    @BeforeEach
    public void setup() {
        // Clean up any test users to guarantee idempotency and avoid NonUniqueResultException
        repository.findAll().forEach(user -> {
            if ("example@example.com".equals(user.getEmail())
                    || "example2@example.com".equals(user.getEmail())
                    || "example".equals(user.getUserName())) {
                repository.delete(user);
            }
        });

        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        driver = new ChromeDriver(options);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Checks if signup form in frontend works properly")
    public void signupClientE2ETest() throws InterruptedException {
        driver.get("http://localhost:5173/signup");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        // Email must not exceed 30 chars due to validation rules:
        String signupEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        String signupUser = "user" + UUID.randomUUID().toString().substring(0, 8);

        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement phoneField = driver.findElement(By.id("phone"));
        WebElement userNameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement repeatPasswordField = driver.findElement(By.id("passwordRepeat"));
        WebElement createAccountButton = driver.findElement(By.className("ot-register__submit"));

        emailField.sendKeys(signupEmail);
        phoneField.sendKeys("123 45 67 89");
        userNameField.sendKeys(signupUser);
        passwordField.sendKeys("Demo1234");
        repeatPasswordField.sendKeys("Demo1234");

        createAccountButton.click();

        wait.until(urlToBe("http://localhost:5173/"));
        driver.get("http://localhost:5173/profile");

        WebElement userName = wait.until(
                visibilityOfElementLocated(By.className("ot-my-profile__name")));
        WebElement email = wait.until(visibilityOfElementLocated(By.xpath(
                "//dt[normalize-space()='Correo electrónico']/following-sibling::dd")));
        WebElement phone = wait.until(visibilityOfElementLocated(By.xpath(
                "//dt[normalize-space()='Número de teléfono']/following-sibling::dd")));

        assertEquals(signupUser, userName.getText());
        assertEquals(signupEmail, email.getText());
        assertEquals("123 45 67 89", phone.getText());
    }

    @Test
    @DisplayName("Checks if signup form in frontend works properly with repeated email")
    public void signupRepeatedEmailClientE2ETest() throws InterruptedException {
        // Create user in database with a known email
        repository.save(
                new User(
                        "example@example.com",
                        "Demo1234",
                        "example",
                        "111 111 111",
                        false,
                        "USER"));

        driver.get("http://localhost:5173/signup");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement phoneField = driver.findElement(By.id("phone"));
        WebElement userNameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement repeatPasswordField = driver.findElement(By.id("passwordRepeat"));
        WebElement createAccountButton = driver.findElement(By.className("ot-register__submit"));

        emailField.sendKeys("example@example.com");
        phoneField.sendKeys("123 45 67 89");
        userNameField.sendKeys("diffUser" + UUID.randomUUID().toString().substring(0, 6));
        passwordField.sendKeys("Demo1234");
        repeatPasswordField.sendKeys("Demo1234");

        createAccountButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals(
                "El correo electrónico escogido ya está siendo utilizado por otro usuario. Introduce otro correo electrónico e inténtalo de nuevo.",
                errorCard.getText());
    }

    @Test
    @DisplayName("Checks if signup form in frontend works properly with repeated username")
    public void signupRepeatedUserClientE2ETest() throws InterruptedException {
        // Create user in database with a known username
        repository.save(
                new User(
                        "example2@example.com",
                        "Demo1234",
                        "example",
                        "111 111 111",
                        false,
                        "USER"));

        driver.get("http://localhost:5173/signup");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement phoneField = driver.findElement(By.id("phone"));
        WebElement userNameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement repeatPasswordField = driver.findElement(By.id("passwordRepeat"));
        WebElement createAccountButton = driver.findElement(By.className("ot-register__submit"));

        // Email must not exceed 30 chars due to validation rules:
        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        emailField.sendKeys(uniqueEmail);
        phoneField.sendKeys("123 45 67 89");
        userNameField.sendKeys("example");
        passwordField.sendKeys("Demo1234");
        repeatPasswordField.sendKeys("Demo1234");

        createAccountButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals(
                "El nombre de usuario escogido ya está siendo utilizado por otro usuario. Introduce otro nombre de usuario e inténtalo de nuevo.",
                errorCard.getText());
    }
}
