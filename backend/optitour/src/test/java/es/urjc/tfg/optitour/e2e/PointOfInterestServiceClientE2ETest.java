package es.urjc.tfg.optitour.e2e;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

import java.time.Duration;
import java.util.List;

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
        wait = new WebDriverWait(driver, Duration.ofSeconds(5));
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
}
