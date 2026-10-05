package es.urjc.tfg.optitour.e2e;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

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

public class ImageControllerClientE2ETest {
    protected WebDriver driver;

    @BeforeEach
    public void setUp() {
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
    @DisplayName("Checks if images load correctly in index")
    void indexImagesTest() {
        driver.get("http://localhost:5173");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement carousel = wait.until(visibilityOfElementLocated(By.className("ot-index__hero")));
        assertNotNull(carousel);

        WebElement tourCarouselCardTitle = wait.until(visibilityOfElementLocated(By.className("ot-carousel__slide-title")));
        WebElement tourCarouselCardDesc = driver.findElement(By.className("ot-login__visual-tagline"));

        assertEquals("Madrid, España", tourCarouselCardTitle.getText());
        assertEquals("Descubre la capital de España, sus museos y su vibrante vida nocturna.",
                tourCarouselCardDesc.getText());

        WebElement seeMoreButton = driver.findElement(By.className("ot-carousel__slide-button"));
        assertEquals("http://localhost:5173/tour/1", seeMoreButton.getAttribute("href"));
    }

}