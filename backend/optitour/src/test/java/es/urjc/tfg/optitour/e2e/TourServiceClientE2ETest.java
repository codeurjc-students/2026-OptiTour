package es.urjc.tfg.optitour.e2e;

import java.time.Duration;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
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
        options.addArguments("--window-size=1920,1080");

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
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
        }

        // Now, get the list (waiting until it's visible) and check if one of its
        // elements is correct.
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(visibilityOfElementLocated(By.className("ot-tour-card__title")));

        WebElement tourTitle = driver.findElement(By.className("ot-tour-card__title"));
        String listItemText = tourTitle.getText();

        assertThat(listItemText, containsString("Madrid, España"));

        WebElement tourDesc = driver.findElement(By.className("ot-tour-desc"));
        String tourDescText = tourDesc.getText();

        assertThat(tourDescText,
                containsString("Descubre la capital de España, sus museos y su vibrante vida nocturna."));
    }

    @Test
    @DisplayName("Checks if loadMore botton works properly")
    public void loadMoreTest() throws InterruptedException {
        driver.get("http://localhost:5173");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement loadMoreButton = wait.until(elementToBeClickable(By.className("load-more-button")));

        // Do scroll to button
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", loadMoreButton);
        Thread.sleep(500); // Give half second to get to the button

        loadMoreButton.click();

        WebElement newTourCard = wait.until(visibilityOfElementLocated(By.xpath(
                "//div[contains(@class, 'ot-tour-card__title') and text()='Roma, Italia']")));

        String romaTitle = newTourCard.getText();
        assertThat(romaTitle, containsString("Roma, Italia"));
    }

    @Test
    @DisplayName("Checks if tour detail page works properly")
    public void tourDetailTest() {
        driver.get("http://localhost:5173");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        // We also want to check if button link is correct, that's why we dont't visit
        // /tour/1 directly
        WebElement seeMoreButton = wait.until(elementToBeClickable(By.cssSelector("a[href='/tour/1']")));
        seeMoreButton.click();

        WebElement title = wait.until(visibilityOfElementLocated(By.className("ot-tour-detail__title")));
        WebElement desc = driver
                .findElement(By
                        .xpath("//*[text()='Descubre la capital de España, sus museos y su vibrante vida nocturna.']"));

        assertEquals("Madrid, España", title.getText());
        assertEquals("Descubre la capital de España, sus museos y su vibrante vida nocturna.", desc.getText());

        WebElement poiTitle = driver.findElement(
                By.xpath("//*[text()='Museo del Prado']"));

        assertEquals("Museo del Prado", poiTitle.getText());
    }

    @Test
    @DisplayName("Check if tour not found page works properly")
    public void tourNotFoundTest() {
        driver.get("http://localhost:5173/tour/100");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

        WebElement title = wait.until(visibilityOfElementLocated(By.tagName("h1")));
        WebElement errorCard = driver.findElement(By.className("ot-error-card"));

        assertEquals("404: Tour no encontrado", title.getText());
        assertEquals("No existe ningún tour con el ID 100.", errorCard.getText());
    }
}
