package es.urjc.tfg.optitour.e2e;

import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.urlToBe;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;

@SpringBootTest
public class UserServiceClientE2ETest {
    protected WebDriver driver;
    private WebDriverWait wait;

    @Autowired
    UserRepository repository;

    private PasswordEncoder encoder = new BCryptPasswordEncoder();

    @BeforeEach
    public void setup() {
        // Clean up any test users to guarantee idempotency and avoid
        // NonUniqueResultException
        deleteTestUsers();
        keepOnlyDefaultAdmin();

        repository.findByEmail("carmen@example.com").ifPresent(carmen -> {
            if (carmen.getIsBanned()) {
                carmen.setBanned(false);
                repository.save(carmen);
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
        wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    }

    @AfterEach
    public void tearDown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } finally {
            deleteTestUsers();
        }
    }

    private void deleteTestUsers() {
        List<User> testUsers = repository.findAll().stream()
                .filter(user -> "example@example.com".equals(user.getEmail())
                        || "example2@example.com".equals(user.getEmail())
                        || "example".equals(user.getUserName())
                        || (user.getEmail() != null && user.getEmail().endsWith("@ex.com")))
                .toList();

        repository.deleteAll(testUsers);
        repository.flush();
    }

    private void keepOnlyDefaultAdmin() {
        List<User> extraAdmins = repository.findAll().stream()
                .filter(user -> user.getRoles().contains("ADMIN"))
                .filter(user -> !"admin@optitour.com".equals(user.getEmail()))
                .toList();

        repository.deleteAll(extraAdmins);
        repository.flush();
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
    @DisplayName("Checks if signup form in frontend works properly")
    public void signupClientE2ETest() throws InterruptedException {
        driver.get("http://localhost:5173/signup");

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

        WebElement modalBody = wait.until(visibilityOfElementLocated(By.className("ot-modal__body")));
        assertEquals(
                String.format(
                        "Tu cuenta de usuario se ha registrado correctamente en OptiTour. ¡Te damos la bienvenida, %s!",
                        signupUser),
                modalBody.getText());
    }

    @Test
    @DisplayName("Checks if signup form in frontend works properly with repeated email")
    public void signupRepeatedEmailClientE2ETest() throws InterruptedException {
        // Create user in database with a known email
        repository.save(
                new User(
                        "example@example.com",
                        encoder.encode("Demo1234"),
                        "example",
                        "111 111 111",
                        false,
                        "USER"));

        driver.get("http://localhost:5173/signup");

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
                        encoder.encode("Demo1234"),
                        "example",
                        "111 111 111",
                        false,
                        "USER"));

        driver.get("http://localhost:5173/signup");

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

    @Test
    @DisplayName("Accessing /signup as an authenticated user should show an error")
    public void accessingSignupAsAuthClientE2ETest() {
        driver.get("http://localhost:5173/login");
        login("carmen@example.com", "Demo1234");

        // We wait index to load and go to signup
        wait.until(urlToBe("http://localhost:5173/"));
        driver.get("http://localhost:5173/signup");

        // Error page should appear
        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals("Ya estás identificado en el sistema. Para acceder a esta página, cierra sesión.",
                errorCard.getText());
    }

    @Test
    @DisplayName("Accesing as an admin to user panel should show ammount of users")
    public void userPanelAmmmoutnE2EClient() {
        driver.get("http://localhost:5173/admin/users");
        login("admin@optitour.com", "Admin1234");

        wait.until(urlToBe("http://localhost:5173/admin/users"));

        WebElement ammountValue = wait.until(visibilityOfElementLocated(By.className("ot-stat-card__value")));

        assertEquals(String.valueOf(repository.count()), ammountValue.getText());
    }

    @Test
    @DisplayName("Accesing as an admin to user panel should show ammount of users")
    public void userPanelListE2EClient() {
        driver.get("http://localhost:5173/admin/users");
        login("admin@optitour.com", "Admin1234");

        wait.until(urlToBe("http://localhost:5173/admin/users"));

        // Now, we want to check if users appears correctly in user list.
        // We need to extract the first user from list.
        // We get the specfic card from list
        WebElement userCard = wait.until(visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'ot-user-item')][.//span[normalize-space()='Carmen García']]")));

        // Now, we get the name element from extracted user card.
        WebElement userNameElement = userCard.findElement(By.className("ot-user-item__name"));

        assertEquals(userNameElement.getText(), "Carmen García");
    }

    @Test
    @DisplayName("Clicking view profile button from user card should show correct user profile")
    public void userProfileFromPanelE2EClientTest() {
        driver.get("http://localhost:5173/admin/users");
        login("admin@optitour.com", "Admin1234");

        WebElement userCard = wait.until(visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'ot-user-item')][.//span[normalize-space()='Carmen García']]")));

        // Also, we can get viewProfileButton
        WebElement viewProfileBtn = userCard.findElement(By.xpath(".//a[normalize-space()='Ver perfil']"));
        viewProfileBtn.click();

        wait.until(urlToBe("http://localhost:5173/admin/users/2"));

        WebElement userName = wait.until(visibilityOfElementLocated(By.className("ot-my-profile__name")));
        assertEquals("Carmen García", userName.getText());
    }

    @Test
    @DisplayName("Logging in with blocked account should show an error card")
    public void logAsBlockedUserE2EClientTest() {
        driver.get("http://localhost:5173/login");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";

        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", true, "USER"));

        login(uniqueEmail, "Demo1234");

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals("Tu cuenta ha sido bloqueada. Contacta con el administrador para más información.",
                errorCard.getText());
    }

    @Test
    @DisplayName("Checks if delete user form deletes user")
    public void deleteUserE2EClientTest() {
        driver.get("http://localhost:5173/profile/delete");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", false, "USER"));

        login(uniqueEmail, "Demo1234");

        wait.until(urlToBe("http://localhost:5173/profile/delete"));

        WebElement deletePassField = wait.until(visibilityOfElementLocated(By.id("delete-account-password")));
        WebElement checkBox = driver.findElement(By.className("form-check-label"));
        WebElement deleteButton = driver.findElement(By.className("ot-delete-profile__actions"));

        deletePassField.sendKeys("Demo1234");
        checkBox.click();
        deleteButton.click();

        wait.until(urlToBe("http://localhost:5173/"));

        WebElement modalBody = wait.until(visibilityOfElementLocated(By.className("ot-modal__body")));
        assertEquals("Tu cuenta ha sido eliminada correctamente. ¡Vuelve pronto!", modalBody.getText());
    }

    @Test
    @DisplayName("Checks if delete user form shows error on incorrect password")
    public void deleteUserIncorrectPassowrdE2EClientTest() {
        driver.get("http://localhost:5173/profile/delete");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", false, "USER"));

        login(uniqueEmail, "Demo1234");

        wait.until(urlToBe("http://localhost:5173/profile/delete"));

        WebElement deletePassField = wait.until(visibilityOfElementLocated(By.id("delete-account-password")));
        WebElement checkBox = driver.findElement(By.className("form-check-label"));
        WebElement deleteButton = driver.findElement(By.className("ot-delete-profile__actions"));

        deletePassField.sendKeys("incorrect");
        checkBox.click();
        deleteButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals("La contraseña no es correcta.", errorCard.getText());
    }

    @Test
    @DisplayName("Checks if delete user form shows error on deleting unique admin")
    public void deleteUniqueAdminE2EClientTest() {
        driver.get("http://localhost:5173/profile/delete");
        login("admin@optitour.com", "Admin1234");

        wait.until(urlToBe("http://localhost:5173/profile/delete"));

        WebElement deletePassField = wait.until(visibilityOfElementLocated(By.id("delete-account-password")));
        WebElement checkBox = driver.findElement(By.className("form-check-label"));
        WebElement deleteButton = driver.findElement(By.className("ot-delete-profile__actions"));

        deletePassField.sendKeys("Admin1234");
        checkBox.click();
        deleteButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals("No puedes eliminar esta cuenta de administrador porque es la única disponible",
                errorCard.getText());
    }

    @Test
    @DisplayName("Checks if edit user form works properly")
    public void editUserClientE2ETest() {
        driver.get("http://localhost:5173/profile/edit");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        String updatedEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        String updatedUsername = "updated" + UUID.randomUUID().toString().substring(0, 6);
        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", false, "USER"));

        login(uniqueEmail, "Demo1234");

        WebElement editEmailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement editPhoneField = driver.findElement(By.id("phone"));
        WebElement editUsernameField = driver.findElement(By.id("username"));

        editEmailField.clear();
        editEmailField.sendKeys(updatedEmail);
        editPhoneField.clear();
        editPhoneField.sendKeys("222 222 222");
        editUsernameField.clear();
        editUsernameField.sendKeys(updatedUsername);

        wait.until(elementToBeClickable(By.className("ot-edit-profile__save-btn"))).click();

        wait.until(urlToBe("http://localhost:5173/profile"));

        WebElement modalTitle = wait.until(visibilityOfElementLocated(By.className("ot-modal__title")));
        assertEquals("¡Perfil editado!", modalTitle.getText());

        WebElement modalBody = driver.findElement(By.className("ot-modal__body"));
        assertEquals("La información de tu perfil ha sido actualizada correctamente.", modalBody.getText());
    }

    @Test
    @DisplayName("Checks if edit user shows error card if repeated email is sent")
    public void editUserRepeatedEmailClientE2ETest() {
        driver.get("http://localhost:5173/profile/edit");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        String updatedUsername = "updated" + UUID.randomUUID().toString().substring(0, 6);
        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", false, "USER"));

        login(uniqueEmail, "Demo1234");

        WebElement editEmailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement editPhoneField = driver.findElement(By.id("phone"));
        WebElement editUsernameField = driver.findElement(By.id("username"));

        editEmailField.clear();
        editEmailField.sendKeys("carmen@example.com");
        editPhoneField.clear();
        editPhoneField.sendKeys("222 222 222");
        editUsernameField.clear();
        editUsernameField.sendKeys(updatedUsername);

        wait.until(elementToBeClickable(By.className("ot-edit-profile__save-btn"))).click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals(
                "El correo electrónico escogido ya está siendo utilizado por otro usuario. Introduce otro correo electrónico e inténtalo de nuevo.",
                errorCard.getText());
    }

    @Test
    @DisplayName("Checks if edit user shows error card if repeated email is sent")
    public void editUserRepeatedUserNameClientE2ETest() {
        driver.get("http://localhost:5173/profile/edit");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        String updatedEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", false, "USER"));

        login(uniqueEmail, "Demo1234");

        WebElement editEmailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement editPhoneField = driver.findElement(By.id("phone"));
        WebElement editUsernameField = driver.findElement(By.id("username"));

        editEmailField.clear();
        editEmailField.sendKeys(updatedEmail);
        editPhoneField.clear();
        editPhoneField.sendKeys("222 222 222");
        editUsernameField.clear();
        editUsernameField.sendKeys("Carmen García");

        wait.until(elementToBeClickable(By.className("ot-edit-profile__save-btn"))).click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals(
                "El nombre de usuario escogido ya está siendo utilizado por otro usuario. Introduce otro nombre de usuario e inténtalo de nuevo.",
                errorCard.getText());
    }

    @Test
    @DisplayName("Checks if change password form workflow works properly")
    public void editPasswordClientE2ETest() {
        driver.get("http://localhost:5173/profile/edit/password");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", false, "USER"));

        login(uniqueEmail, "Demo1234");

        wait.until(urlToBe("http://localhost:5173/profile/edit/password"));

        WebElement oldPasswordField = wait.until(visibilityOfElementLocated(By.id("oldPassword")));
        WebElement newPasswordField = driver.findElement(By.id("password"));
        WebElement repeatPasswordField = driver.findElement(By.id("passwordRepeat"));
        WebElement editPassworButton = driver.findElement(By.className("ot-edit-password__actions"));

        oldPasswordField.sendKeys("Demo1234");
        newPasswordField.sendKeys("Edited1234");
        repeatPasswordField.sendKeys("Edited1234");
        editPassworButton.click();

        wait.until(urlToBe("http://localhost:5173/profile"));

        WebElement modalTitle = wait.until(visibilityOfElementLocated(By.className("ot-modal__title")));
        assertEquals("¡Contraseña cambiada!", modalTitle.getText());

        WebElement modalBody = driver.findElement(By.className("ot-modal__body"));
        assertEquals("Se ha cambiado correctamente la contraseña de la cuenta.", modalBody.getText());
    }

    @Test
    @DisplayName("Checks if change password form shows error card when old password is not correct")
    public void editPasswordIncorrectPasswordClientE2ETest() {
        driver.get("http://localhost:5173/profile/edit/password");

        String uniqueEmail = "u" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        repository.save(new User(uniqueEmail, encoder.encode("Demo1234"), "example", "111 111 111", false, "USER"));

        login(uniqueEmail, "Demo1234");

        wait.until(urlToBe("http://localhost:5173/profile/edit/password"));

        WebElement oldPasswordField = wait.until(visibilityOfElementLocated(By.id("oldPassword")));
        WebElement newPasswordField = driver.findElement(By.id("password"));
        WebElement repeatPasswordField = driver.findElement(By.id("passwordRepeat"));
        WebElement editPassworButton = driver.findElement(By.className("ot-edit-password__actions"));

        oldPasswordField.sendKeys("incorrect");
        newPasswordField.sendKeys("Edited1234");
        repeatPasswordField.sendKeys("Edited1234");
        editPassworButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-edit-password__error")));
        assertEquals("La contraseña no es correcta.", errorCard.getText());
    }

    @Test
    @DisplayName("Checks if create new admin account form works properly")
    public void signupAdminClientE2ETest() {
        driver.get("http://localhost:5173/admin/create");

        login("admin@optitour.com", "Admin1234");
        wait.until(urlToBe("http://localhost:5173/admin/create"));

        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement phoneField = driver.findElement(By.id("phone"));
        WebElement usernameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement passwordRepeatField = driver.findElement(By.id("passwordRepeat"));
        WebElement submitButton = driver.findElement(By.className("ot-create-admin__submit"));
        String newAdminEmail = "a" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";
        String newAdminUserName = "Admin" + UUID.randomUUID().toString().substring(0, 8);

        emailField.sendKeys(newAdminEmail);
        phoneField.sendKeys("111 111 111");
        usernameField.sendKeys(newAdminUserName);
        passwordField.sendKeys("Admin1234");
        passwordRepeatField.sendKeys("Admin1234");
        submitButton.click();

        wait.until(driver -> driver.getCurrentUrl().matches("http://localhost:5173/admin/users/\\d+"));

        WebElement modalTitle = wait.until(visibilityOfElementLocated(By.cssSelector(".ot-modal__title.modal-title")));
        WebElement modalMessage = driver.findElement(By.className("ot-modal__body"));

        Optional<User> op = repository.findByEmail(newAdminEmail);
        User newAdmin = op.orElseThrow();

        assertEquals("Nueva cuenta de administración creada", modalTitle.getText());
        assertEquals("Se ha creado correctamente la siguiente cuenta de administrador: " + newAdmin.getUserName(),
                modalMessage.getText());
    }

    @Test
    @DisplayName("Checks if create new admin account form works properly")
    public void signupAdminClientRepeatedEmailE2ETest() {
        driver.get("http://localhost:5173/admin/create");

        login("admin@optitour.com", "Admin1234");
        wait.until(urlToBe("http://localhost:5173/admin/create"));

        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement phoneField = driver.findElement(By.id("phone"));
        WebElement usernameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement passwordRepeatField = driver.findElement(By.id("passwordRepeat"));
        WebElement submitButton = driver.findElement(By.className("ot-create-admin__submit"));
        String newAdminUserName = "Admin" + UUID.randomUUID().toString().substring(0, 8);

        emailField.sendKeys("admin@optitour.com");
        phoneField.sendKeys("111 111 111");
        usernameField.sendKeys(newAdminUserName);
        passwordField.sendKeys("Admin1234");
        passwordRepeatField.sendKeys("Admin1234");
        submitButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals(
                "El correo electrónico escogido ya está siendo utilizado por otro usuario. Introduce otro correo electrónico e inténtalo de nuevo.",
                errorCard.getText());
    }

    @Test
    @DisplayName("Checks if create new admin account form works properly")
    public void signupAdminClientRepeatedUserE2ETest() {
        driver.get("http://localhost:5173/admin/create");

        login("admin@optitour.com", "Admin1234");
        wait.until(urlToBe("http://localhost:5173/admin/create"));

        WebElement emailField = wait.until(visibilityOfElementLocated(By.id("email")));
        WebElement phoneField = driver.findElement(By.id("phone"));
        WebElement usernameField = driver.findElement(By.id("username"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement passwordRepeatField = driver.findElement(By.id("passwordRepeat"));
        WebElement submitButton = driver.findElement(By.className("ot-create-admin__submit"));
        String newAdminEmail = "a" + UUID.randomUUID().toString().substring(0, 8) + "@ex.com";

        emailField.sendKeys(newAdminEmail);
        phoneField.sendKeys("111 111 111");
        usernameField.sendKeys("Admin");
        passwordField.sendKeys("Admin1234");
        passwordRepeatField.sendKeys("Admin1234");
        submitButton.click();

        WebElement errorCard = wait.until(visibilityOfElementLocated(By.className("ot-error-card")));
        assertEquals(
                "El nombre de usuario escogido ya está siendo utilizado por otro usuario. Introduce otro nombre de usuario e inténtalo de nuevo.",
                errorCard.getText());
    }
}