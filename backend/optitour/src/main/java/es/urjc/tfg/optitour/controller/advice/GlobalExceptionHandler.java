package es.urjc.tfg.optitour.controller.advice;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * This class is an exception handler for OptiTour REST API field validation, so
 * error responses are not too large
 * as without this configuration.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final List<String> CONSTRAINT_PRIORITY = List.of(
            "NotBlank",
            "NotNull",
            "NotEmpty",
            "Size",
            "Pattern",
            "Email");

    private int getPriority(FieldError error) {
        if (error.getCode() != null) {
            for (int i = 0; i < CONSTRAINT_PRIORITY.size(); i++) {
                if (error.getCode().equalsIgnoreCase(CONSTRAINT_PRIORITY.get(i))) {
                    return i;
                }
            }
        }
        if (error.getCodes() != null) {
            for (String code : error.getCodes()) {
                for (int i = 0; i < CONSTRAINT_PRIORITY.size(); i++) {
                    String constraint = CONSTRAINT_PRIORITY.get(i);
                    if (code.equalsIgnoreCase(constraint) || code.startsWith(constraint + ".")) {
                        return i;
                    }
                }
            }
        }
        return 999;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)

    /**
     * Intercepts MethodArgumentNotValidException.
     * 
     * This exception is thrown by SpringBoot when a post request body annotated
     * with @Valid fails Jakarta Validation Constraints
     * Response returned with this exception is too large, so we can reduce it to a
     * simple JSON with one message field.
     * 
     * @param ex Exception containing field validation errors
     * @return A reduced JSON response containing only error message to show in
     *         frontend.
     */
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> response = new HashMap<>(); // Map to strucutre JSON response.

        // Exception contains a list of all fields that failed validation.
        // We prioritize NotBlank/NotNull over Size/Pattern so the most relevant error
        // is returned first.
        FieldError chosenError = ex.getBindingResult().getFieldErrors().stream()
                .min(Comparator.comparingInt(this::getPriority))
                .orElse(ex.getBindingResult().getFieldErrors().get(0));

        // We set the message field in response with only error message,
        // so text returned is readable by user and is not a full Java stack trace.
        response.put("message", chosenError.getDefaultMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<Map<String, String>> handleLockedExpcetion(LockedException e) {
        return new ResponseEntity<>(
                Map.of("message",
                        "Tu cuenta ha sido bloqueada. \n Contacta con el administrador para más información."),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentialsEsception(BadCredentialsException e) {
        return new ResponseEntity<>(
                Map.of("message", "Credenciales incorrectas. Revisa tu correo o contraseña."),
                HttpStatus.FORBIDDEN);
    }
}
