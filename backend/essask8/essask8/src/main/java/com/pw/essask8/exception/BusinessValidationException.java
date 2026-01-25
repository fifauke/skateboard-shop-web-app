package com.pw.essask8.exception;

import java.util.Map;
import java.util.Collections;

public class BusinessValidationException extends RuntimeException {
    private final Map<String, String> errors;

    public BusinessValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public BusinessValidationException(String fieldName, String message) {
        super(message);
        this.errors = Collections.singletonMap(fieldName, message);
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}