package com.example.mini_project.util;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApiException(ApiException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(Map.of(
                        "message", ex.getMessage(),
                        "reason", ex.getReason()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> fieldOrder = List.of("fullName", "monthlyIncome", "loanAmount", "loanPurpose", "age", "phoneNumber", "email");
        List<String> missingFields = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getField)
                .distinct()
                .sorted(Comparator.comparingInt(fieldOrder::indexOf))
                .collect(Collectors.toList());

        String reason = "missing required fields: " + String.join(", ", missingFields);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Invalid request body");
        response.put("reason", reason);

        return ResponseEntity.badRequest().body(response);
    }
}
