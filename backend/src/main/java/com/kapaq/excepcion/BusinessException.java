package com.kapaq.excepcion;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
