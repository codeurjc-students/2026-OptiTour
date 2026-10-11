package es.urjc.tfg.optitour.e2e;

import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.urlToBe;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Duration;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserServiceClientE2ETest {
    protected WebDriver driver;

    @BeforeEach
    public void setup() {
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

    @Test
    @DisplayName("Checks if signup form in frontend works properly")
    public void signupClientE2ETest() throws InterruptedException {
        driver.get("http://localhost:5173/signup");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        String signupEmail = "selenium-" + UUID.randomUUID() + "@example.com";

        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement phoneField = driver.findElement(By.id("phone"));
        WebElement userNameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement repeatPasswordField = driver.findElement(By.id("passwordRepeat"));
        WebElement createAccountButton = driver.findElement(By.className("ot-register__submit"));

        emailField.sendKeys(signupEmail);
        phoneField.sendKeys("123 45 67 89");
        userNameField.sendKeys("example");
        passwordField.sendKeys("demo1234");
        repeatPasswordField.sendKeys("demo1234");

        Thread.sleep(2000);
        createAccountButton.click();

        wait.until(urlToBe("http://localhost:5173/"));
        driver.get("http://localhost:5173/profile");

        WebElement userName = wait.until(
                visibilityOfElementLocated(By.className("ot-my-profile__name")));
        WebElement email = wait.until(visibilityOfElementLocated(By.xpath(
                "//dt[normalize-space()='Correo electrónico']/following-sibling::dd")));
        WebElement phone = wait.until(visibilityOfElementLocated(By.xpath(
                "//dt[normalize-space()='Número de teléfono']/following-sibling::dd")));

        assertEquals("example", userName.getText());
        assertEquals(signupEmail, email.getText());
        assertEquals("123 45 67 89", phone.getText());
    }
}