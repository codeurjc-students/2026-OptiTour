package es.urjc.tfg.optitour.e2e;

import static org.junit.jupiter.api.Assertions.assertEquals;

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

import es.urjc.tfg.optitour.BaseIntegrationTest;

import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TourServiceClientE2ETest extends BaseIntegrationTest {
    protected WebDriver driver;

    @BeforeEach
    public void setUp() {
        // We add some configurations so Google Chrome Window don't appear, in order to
        // avoid problems with GitHub Actions
        ChromeOptions options = new ChromeOptions();
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

        // We get the title element and check if it's correct.
        WebElement title = driver.findElement(By.tagName("h1"));
        String titleText = title.getText();

        assertEquals(titleText, "OptiTour");

        // Now, get the list (waiting until it's visible) and check if one of its
        // elements is correct.
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(visibilityOfElementLocated(By.id("1")));

        WebElement listItem = driver.findElement(By.id("1"));
        String listItemText = listItem.getText();

        assertThat(listItemText, containsString("1: Tour 1"));
    }
}
