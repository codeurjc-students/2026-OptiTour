package es.urjc.tfg.optitour.e2e;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.openqa.selenium.support.ui.ExpectedConditions.textToBePresentInElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;

import java.time.Duration;

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
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class AuthClientE2ETest {
    protected WebDriver driver;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        options.addArguments("--ignore-certificate-errors");

        options.addArguments("--headless=new");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");

        driver = new ChromeDriver(options);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Check if login form works properly")
    public void loginFormTest() {
        driver.get("http://localhost:5173");
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
        }

        // We define de wait object
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        // We wait to the loginButton and click on it
        WebElement loginNavButton = wait.until(elementToBeClickable(By.className("loginButton")));
        loginNavButton.click();

        // Now, we wait to the page to render. We can simply wait for one of the form
        // fields.
        WebElement emailField = null;
        try {
            emailField = wait.until(visibilityOfElementLocated(By.id("loginEmail")));
        } catch (org.openqa.selenium.TimeoutException e) {
            System.err.println(
                    "TIMEOUT in badLoginFormTest waiting for emailField. Page source: " + driver.getPageSource());
            throw e;
        }

        // We get the rest of the form elements: fields and submmit button
        driver.findElement(By.id("loginEmail"));
        WebElement passField = driver.findElement(By.id("loginPassword"));
        WebElement submitButton = driver.findElement(By.className("ot-login__submit"));

        // We fill the form with correct admin credentials.
        emailField.sendKeys("admin@optitour.com");
        passField.sendKeys("admin1234");
        submitButton.click();

        // We wait to the index page to render
        WebElement logoutButton = null;
        try {
            logoutButton = wait.until(visibilityOfElementLocated(By.className("btn-outline-danger")));
        } catch (org.openqa.selenium.TimeoutException e) {
            System.err.println("TIMEOUT in loginFormTest. Page source: " + driver.getPageSource());
            throw e;
        }

        // We check if admin buttons appear. If this buttons exist, then logging was
        // succesful and user roles are working correctly.
        WebElement adminButton = driver.findElement(By.className("adminButton"));

        String buttonText = logoutButton.getText();
        String adminButtonText = adminButton.getText();

        assertEquals(buttonText, "Cerrar Sesión");
        assertEquals(adminButtonText, "Panel de administración");
    }

    @Test
    @DisplayName("If credentials are incorrect, error card should be shown")
    void badLoginFormTest() {
        driver.get("http://localhost:5173/login");
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
        }

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement emailField = null;
        try {
            emailField = wait.until(visibilityOfElementLocated(By.id("loginEmail")));
        } catch (org.openqa.selenium.TimeoutException e) {
            System.err.println(
                    "TIMEOUT in badLoginFormTest waiting for emailField. Page source: " + driver.getPageSource());
            throw e;
        }
        WebElement passField = driver.findElement(By.id("loginPassword"));
        WebElement submitButton = driver.findElement(By.className("ot-login__submit"));

        emailField.sendKeys("bademail@example.com");
        passField.sendKeys("badpass");
        submitButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        String errorCardText = errorCard.getText();

        assertEquals(errorCardText, "Credenciales incorrectas.");

        driver.quit();
    }

    @Test
    @DisplayName("If anonymous user access /admin/profile without athentication, login form must appear with a special error card. If user access with admin account, login must be succesfull and go to the requested URL, that must show user data.")
    void privateURLLoginFormTest() {
        driver.get("http://localhost:5173/admin/profile"); // We directly visit /admin/profile

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        String errorCardText = errorCard.getText();

        assertEquals(errorCardText, "Para acceder a la página solicitada necesitas autenticación.");

        WebElement emailField = driver.findElement(By.id("loginEmail"));
        WebElement passField = driver.findElement(By.id("loginPassword"));
        WebElement submitButton = driver.findElement(By.className("ot-login__submit"));

        // We fill the form with correct admin credentials.
        emailField.sendKeys("admin@optitour.com");
        passField.sendKeys("admin1234");
        submitButton.click();

        WebElement userName = null;
        try {
            userName = wait.until(visibilityOfElementLocated(By.className("ot-my-profile__name")));
        } catch (org.openqa.selenium.TimeoutException e) {
            System.err.println(
                    "TIMEOUT in privateURLLoginFormTest waiting for userName. Page source: " + driver.getPageSource());
            throw e;
        }
        String userNameText = userName.getText();

        assertEquals(userNameText, "ExampleAdmin");
    }

    @Test
    @DisplayName("Same case that last test, but now user hasn't necessary roles to access the requested URL, so 403 error page is shown")
    void privateURLLoginFormNoRolesTest() {
        driver.get("http://localhost:5173/admin/profile"); // We directly visit /admin/profile

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        String errorCardText = errorCard.getText();

        assertEquals(errorCardText, "Para acceder a la página solicitada necesitas autenticación.");

        WebElement emailField = driver.findElement(By.id("loginEmail"));
        WebElement passField = driver.findElement(By.id("loginPassword"));
        WebElement submitButton = driver.findElement(By.className("ot-login__submit"));

        // We fill the form with an account with no admin role.
        emailField.sendKeys("example@example.com");
        passField.sendKeys("demo1234");
        submitButton.click();

        // The error card has the same class, so we need to wait to the text to be
        // changed
        wait.until(textToBePresentInElementLocated(
                By.className("ot-error-card"),
                "No tienes permisos suficientes para acceder a esta página."));

        WebElement unauthorizedError = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        String unauthorizedErrorText = unauthorizedError.getText();

        assertEquals(unauthorizedErrorText, "No tienes permisos suficientes para acceder a esta página.");
    }

    @Test
    @DisplayName("Checks if 404 page works properly")
    void notFoundPageTest() {
        driver.get("http://localhost:5173/non-existing-page");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        wait.until(textToBePresentInElementLocated(
                By.className("ot-error-card"),
                "La página solicitada no existe."));

        WebElement errorCard = driver.findElement(By.className("ot-error-card"));
        String errorCardText = errorCard.getText();

        assertEquals(errorCardText, "La página solicitada no existe.");
    }
}