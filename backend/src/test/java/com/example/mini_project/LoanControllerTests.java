package com.example.mini_project.loan.controller;

import com.example.mini_project.loan.service.LoanService;
import com.example.mini_project.loan.service.model.LoanServiceRequest;
import com.example.mini_project.loan.service.model.LoanServiceResponse;
import com.example.mini_project.util.ApiException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.mockito.Mockito.*;

class LoanControllerTests {

    @Mock
    private LoanService loanService;

    @InjectMocks
    private LoanController loanController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void submitLoanValidRequestReturnsOkResponse() {

        String rUuid = UUID.randomUUID().toString();
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(30)
                .fullName("John Doe")
                .monthlyIncome(20000)
                .loanAmount(100000)
                .loanPurpose("home")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .build();

        LoanServiceResponse serviceResponse = LoanServiceResponse.builder()
                .applicationId(rUuid)
                .eligible(true)
                .reason("Eligible under base rules")
                .build();

        when(loanService.loanSubmit(request)).thenReturn(serviceResponse);

        ResponseEntity<LoanServiceResponse> response = loanController.submitLoan(request);

        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertTrue(response.getBody().getEligible());
        Assertions.assertEquals("Eligible under base rules", response.getBody().getReason());
        Assertions.assertEquals(rUuid, response.getBody().getApplicationId());
    }
    @Test
    void submitLoanInvalidRequestThrowsApiException() {
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(65)
                .fullName("John Doe")
                .monthlyIncome(20000)
                .loanAmount(100000)
                .loanPurpose("home")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .build();

        when(loanService.loanSubmit(request)).thenThrow(new ApiException("Invalid request body","Age not in range (must be between 20-60)", HttpStatus.BAD_REQUEST));

        ApiException exception = Assertions.assertThrows(ApiException.class, () -> loanController.submitLoan(request));

        Assertions.assertEquals("Age not in range (must be between 20-60)", exception.getReason());
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }
}