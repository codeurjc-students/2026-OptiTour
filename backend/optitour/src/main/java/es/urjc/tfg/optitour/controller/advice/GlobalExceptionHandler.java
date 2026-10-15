package es.urjc.tfg.optitour.controller.advice;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        // We extract the first error found, so user is not overwhelmed.
        FieldError firstError = ex.getBindingResult().getFieldErrors().get(0);

        // We set the message field in response with only error message,
        // so text returned is readable by user and is not a full Java stack trace.
        response.put("message", firstError.getDefaultMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
