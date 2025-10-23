package com.example.mini_project.util;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException{
    private final String reason;
    private final HttpStatus status;

    public ApiException(String message, String reason, HttpStatus status) {
        super(message);
        this.reason = reason;
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
