package es.urjc.tfg.optitour.e2e;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.urlToBe;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

import java.nio.file.Path;
import java.time.Duration;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;

@SpringBootTest
public class PointOfInterestServiceClientE2ETest {
    protected WebDriver driver;
    private WebDriverWait wait;

    @Autowired
    PointOfInterestRepository repository;

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
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    private void login(String email, String password) {
        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("loginEmail")));
        WebElement passField = driver.findElement(By.id("loginPassword"));
        WebElement submitButton = driver.findElement(By.className("ot-login__submit"));

        emailField.sendKeys(email);
        passField.sendKeys(password);
        submitButton.click();
    }

    @Test
    @DisplayName("Checks if poi detail page renders properly with production data")
    public void poiDetailPageTest() {
        // We go directly to tour detail page.
        // We already tested se more button on index, it's not necessary to start in
        // index.
        driver.get("http://localhost:5173/tour/1");

        WebElement seeMoreButton = wait.until(elementToBeClickable(By.cssSelector("a[href='/point-of-interest/1']")));
        seeMoreButton.click();

        WebElement title = wait.until(visibilityOfElementLocated(By.className("ot-poi-detail__title")));
        WebElement desc = driver
                .findElement(By.xpath("//*[text()='Pinacoteca con obras maestras de Velázquez y Goya.']"));
        WebElement cityAndAddress = driver
                .findElement(By.xpath("//dt[text()='Ciudad y dirección']/following-sibling::dd"));
        WebElement coords = driver.findElement(By.xpath("//*[text()='40.4137818,-3.6921271']"));

        assertEquals("Museo del Prado", title.getText());
        assertEquals("Pinacoteca con obras maestras de Velázquez y Goya.", desc.getText());
        assertEquals("Madrid: Calle de Ruiz de Alarcón, 23", cityAndAddress.getText());
        assertEquals("40.4137818,-3.6921271", coords.getText());

        WebElement availableTour = driver.findElement(By.xpath("//*[text()='Madrid, España']"));
        assertEquals("Madrid, España", availableTour.getText());

    }

    @Test
    @DisplayName("Checks if poi not found page works properly")
    public void poiNotFoundTest() {
        driver.get("http://localhost:5173/point-of-interest/1000");

        WebElement title = wait.until(visibilityOfElementLocated(By.tagName("h1")));
        WebElement errorCard = driver.findElement(By.className("ot-error-card"));

        assertEquals("404: Punto de interés no encontrado", title.getText());
        assertEquals("No existe ningún punto de interés con el ID 1000.", errorCard.getText());
    }

    @Test
    @DisplayName("Checks if pagination in poi panel works properly")
    public void poiManagementClientE2ETest() {
        driver.get("http://localhost:5173/admin/poi");
        login("admin@optitour.com", "Admin1234");

        wait.until(visibilityOfElementLocated(By.className("ot-list-item__title")));
        List<WebElement> items = driver.findElements(By.className("ot-list-item__title"));

        assertNotNull(items);
        assertEquals(10, items.size());

        WebElement loadMoreButton = driver.findElement(By.className("ot-tour-card__btn"));
        loadMoreButton.click();

        wait.until(invisibilityOfElementLocated((By.className("ot-spinner"))));

        wait.until(visibilityOfElementLocated(By.className("ot-list-item__title")));
        List<WebElement> moreItems = driver.findElements(By.className("ot-list-item__title"));

        assertNotNull(moreItems);
        assertEquals(15, moreItems.size());
    }

    @Test
    @DisplayName("Checks if poi ammount displayed is correct")
    public void poiManagementAmmountClientE2ETest() {
        driver.get("http://localhost:5173/admin/poi");
        login("admin@optitour.com", "Admin1234");

        WebElement ammountCard = wait.until(visibilityOfElementLocated(By.className("ot-stat-card__value")));
        assertEquals(repository.count(), Integer.parseInt(ammountCard.getText()));
    }

    @Test
    @DisplayName("Checks if poi creation form works properly, and then the detail is showed")
    public void poiCreationFormClientE2ETest() {
        driver.get("http://localhost:5173/admin/addpoi");
        login("admin@optitour.com", "Admin1234");

        wait.until(urlToBe("http://localhost:5173/admin/addpoi"));

        String createdPoiName = "New POI " + System.currentTimeMillis();
        WebElement nameField = wait.until(visibilityOfElementLocated(By.id("poiName")));
        WebElement descField = driver.findElement(By.id("poiDescription"));
        WebElement cityField = driver.findElement(By.id("poiCity"));
        WebElement addressField = driver.findElement(By.id("poiAddress"));
        WebElement latitudeField = driver.findElement(By.id("poiLat"));
        WebElement longitudeField = driver.findElement(By.id("poiLng"));
        WebElement imageField = driver.findElement(By.id("upload-image"));

        nameField.sendKeys(createdPoiName);
        descField.sendKeys("New POI desc");
        cityField.sendKeys("Test City");
        addressField.sendKeys("Test address");
        latitudeField.sendKeys("1.11111");
        longitudeField.sendKeys("1.11111");
        String firstImagePath = Path.of("..", "..", "docs", "images", "tour-service-e2e-test.png")
                .toAbsolutePath().normalize().toString();
        String secondImagePath = Path.of("..", "..", "docs", "images", "tour-service-client-integration-test.png")
                .toAbsolutePath().normalize().toString();
        imageField.sendKeys(firstImagePath + "\n" + secondImagePath);

        // Wait for image slots to be rendered, ensuring React processed the file inputs
        wait.until(driver -> driver.findElements(By.className("ot-create-poi__image-slot")).size() == 2);

        WebElement submitButton = wait.until(elementToBeClickable(By.className("ot-create-poi__submit")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", submitButton);
        try {
            Thread.sleep(500);
        } catch (InterruptedException ignored) {
        }

        // Trigger submission via JavaScript click to avoid coordinate misfires in headless Chrome
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitButton);

        // Fallback: If form submission didn't trigger immediately, dispatch requestSubmit on the form
        try {
            new WebDriverWait(driver, Duration.ofSeconds(3)).until(d ->
                    d.getCurrentUrl().equals("http://localhost:5173/admin/poi")
                    || !d.findElements(By.className("ot-error-card")).isEmpty()
                    || "Creando punto de interés".equals(d.findElement(By.className("ot-create-poi__submit")).getText())
            );
        } catch (TimeoutException ignored) {
            WebElement form = driver.findElement(By.tagName("form"));
            ((JavascriptExecutor) driver).executeScript("arguments[0].requestSubmit();", form);
        }

        try {
            wait.until(driver -> driver.getCurrentUrl().equals("http://localhost:5173/admin/poi")
                    || !driver.findElements(By.className("ot-error-card")).isEmpty());
        } catch (TimeoutException e) {
            String url = driver.getCurrentUrl();
            String btnText = "";
            try {
                btnText = driver.findElement(By.className("ot-create-poi__submit")).getText();
            } catch (Exception ignored) {
            }
            List<WebElement> invalidFeedbacks = driver.findElements(By.className("invalid-feedback"));
            StringBuilder feedbackMsg = new StringBuilder();
            for (WebElement fb : invalidFeedbacks) {
                if (fb.isDisplayed() && !fb.getText().isBlank()) {
                    feedbackMsg.append("[").append(fb.getText()).append("] ");
                }
            }
            List<WebElement> errorCards = driver.findElements(By.className("ot-error-card"));
            StringBuilder errorCardMsg = new StringBuilder();
            for (WebElement ec : errorCards) {
                errorCardMsg.append("[").append(ec.getText()).append("] ");
            }
            throw new AssertionError("POI creation timeout after 15s! URL: " + url
                    + " | Submit button text: '" + btnText + "'"
                    + " | Validation errors: " + feedbackMsg
                    + " | Error card: " + errorCardMsg, e);
        }

        assertEquals("http://localhost:5173/admin/poi", driver.getCurrentUrl(),
                () -> {
                    List<WebElement> errors = driver.findElements(By.className("ot-error-card"));
                    return errors.isEmpty() ? "POI creation timed out without navigating to /admin/poi"
                            : "POI creation failed: " + errors.get(0).getText();
                });
        WebElement modalNavButton = wait
                .until(elementToBeClickable(By.className("ot-modal__nav-btn")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", modalNavButton);

        PointOfInterest newPoi = repository.findByName(createdPoiName).get();
        assertNotNull(newPoi);

        wait.until(urlToBe("http://localhost:5173/point-of-interest/" + newPoi.getId()));

        WebElement poiName = wait.until(visibilityOfElementLocated(By.className("ot-poi-detail__title")));
        assertEquals(createdPoiName, poiName.getText());
    }
}
