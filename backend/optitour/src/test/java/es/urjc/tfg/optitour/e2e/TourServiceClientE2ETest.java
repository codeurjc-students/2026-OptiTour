package es.urjc.tfg.optitour.e2e;

import java.time.Duration;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest
public class TourServiceClientE2ETest {
    protected WebDriver driver;

    @BeforeEach
    public void setUp() {
        // We add some configurations so Google Chrome Window don't appear, in order to
        // avoid problems with GitHub Actions
        ChromeOptions options = new ChromeOptions();
        options.setAcceptInsecureCerts(true);
        options.addArguments("--ignore-certificate-errors");
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");

        driver = new ChromeDriver(options);

    }

    // After each test, we tear down the driver if it's active.
    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Check if rendered list in frontend is correct")
    public void getAllToursClientE2ETest() {
        driver.get("http://localhost:5173"); // We visit the frontend app
        try { Thread.sleep(1000); } catch (Exception e) {}

        // Now, get the list (waiting until it's visible) and check if one of its
        // elements is correct.
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(visibilityOfElementLocated(By.className("ot-tour-card__title")));

        WebElement tourTitle = driver.findElement(By.className("ot-tour-card__title"));
        String listItemText = tourTitle.getText();

        assertThat(listItemText, containsString("Madrid, España"));

        WebElement tourDesc = driver.findElement(By.className("ot-tour-desc"));
        String tourDescText = tourDesc.getText();

        assertThat(tourDescText, containsString("Descubre la capital de España, sus museos y su vibrante vida nocturna."));
    }
}
