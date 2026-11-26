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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;

import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.service.ImageService;

@SpringBootTest
public class TourServiceClientE2ETest {
    protected WebDriver driver;
    private WebDriverWait wait;

    @Autowired
    private PointOfInterestRepository repository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ImageService imageService;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @BeforeEach
    public void setUp() {
        restoreDefaultPois();

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
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    private void restoreDefaultPois() {
        try {
            transactionTemplate.executeWithoutResult(status -> {
                PointOfInterest prado = repository.findById(1L).orElse(null);
                if (prado == null) {
                    jdbcTemplate.update(
                            "INSERT INTO point_of_interest (id, name, description, city, address, coords, created_at) "
                                    + "VALUES (1, 'Museo del Prado', 'Pinacoteca con obras maestras de Velázquez y Goya.', "
                                    + "'Madrid', 'Calle de Ruiz de Alarcón, 23', '40.4137818,-3.6921271', NOW())");
                    prado = repository.findById(1L).orElse(null);
                } else {
                    boolean modified = false;
                    if (!"Museo del Prado".equals(prado.getName())) {
                        prado.setName("Museo del Prado");
                        modified = true;
                    }
                    if (!"Pinacoteca con obras maestras de Velázquez y Goya.".equals(prado.getDescription())) {
                        prado.setDescription("Pinacoteca con obras maestras de Velázquez y Goya.");
                        modified = true;
                    }
                    if (!"Madrid".equals(prado.getCity())) {
                        prado.setCity("Madrid");
                        modified = true;
                    }
                    if (!"Calle de Ruiz de Alarcón, 23".equals(prado.getAddress())) {
                        prado.setAddress("Calle de Ruiz de Alarcón, 23");
                        modified = true;
                    }
                    if (!"40.4137818,-3.6921271".equals(prado.getCoords())) {
                        prado.setCoords("40.4137818,-3.6921271");
                        modified = true;
                    }
                    if (modified) {
                        repository.saveAndFlush(prado);
                    }
                }

                if (prado != null) {
                    final PointOfInterest finalPrado = prado;
                    tourRepository.findAll().stream()
                            .filter(t -> "Madrid, España".equals(t.getName()))
                            .findFirst()
                            .ifPresent(madridTour -> {
                                if (madridTour.getPois().stream().noneMatch(p -> p.getId() == 1L)) {
                                    madridTour.getPois().add(0, finalPrado);
                                    tourRepository.saveAndFlush(madridTour);
                                }
                            });

                    Integer imageCount = jdbcTemplate.queryForObject(
                            "SELECT COUNT(*) FROM image WHERE poi_id = 1", Integer.class);
                    if (imageCount == null || imageCount == 0) {
                        for (int i = 1; i <= 3; i++) {
                            try {
                                Resource imgRes = new ClassPathResource(
                                        "/sample-images/poi/madrid/museo-del-prado/museo-del-prado-" + i + ".jpg");
                                if (imgRes.exists()) {
                                    Image createdImage = imageService.createImage(imgRes.getInputStream());
                                    createdImage.setPoi(finalPrado);
                                    imageService.saveImage(createdImage);
                                }
                            } catch (Exception ignored) {
                            }
                        }
                    }
                }
            });
        } catch (Exception e) {
            System.err.println("Could not restore default POIs: " + e.getMessage());
        }
    }

    // After each test, we tear down the driver if it's active.
    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    @DisplayName("Check if paginated tour list in frontend is correct")
    public void paginatedToursClientE2ETest() {
        driver.get("http://localhost:5173"); // We visit the frontend app
        try {
            Thread.sleep(1000);
        } catch (Exception e) {
        }

        // Now, get the list (waiting until it's visible) and check if one of its
        // elements is correct.
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

        // We also want to check if button link is correct, that's why we dont't visit
        // /tour/1 directly
        WebElement seeMoreButton = wait.until(elementToBeClickable(By.cssSelector("a[href='/tour/1']")));
        // The carousel navigation controls can overlap this link at some viewport
        // widths, so trigger the link's own DOM click event instead of relying on
        // the physical click coordinates.
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", seeMoreButton);

        WebElement title = wait.until(visibilityOfElementLocated(By.className("ot-tour-detail__title")));
        WebElement desc = wait.until(visibilityOfElementLocated(
                By.xpath("//*[text()='Descubre la capital de España, sus museos y su vibrante vida nocturna.']")));

        assertEquals("Madrid, España", title.getText());
        assertEquals("Descubre la capital de España, sus museos y su vibrante vida nocturna.", desc.getText());

        WebElement poiTitle = wait.until(visibilityOfElementLocated(
                By.xpath("//*[text()='Museo del Prado']")));

        assertEquals("Museo del Prado", poiTitle.getText());
    }

    @Test
    @DisplayName("Check if tour not found page works properly")
    public void tourNotFoundTest() {
        driver.get("http://localhost:5173/tour/100");

        WebElement title = wait.until(visibilityOfElementLocated(By.tagName("h1")));
        WebElement errorCard = driver.findElement(By.className("ot-error-card"));

        assertEquals("404: Tour no encontrado", title.getText());
        assertEquals("No existe ningún tour con el ID 100.", errorCard.getText());
    }
}
