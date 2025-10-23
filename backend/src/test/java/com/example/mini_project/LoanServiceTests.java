package com.example.mini_project;

import com.example.mini_project.loan.entity.LoanEntity;
import com.example.mini_project.loan.repository.LoanRepository;
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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;

class LoanServiceTests {

    @Mock
    private LoanRepository loanRepository;

    @InjectMocks
    private LoanService loanService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void loanSubmitValidRequestReturnsEligibleResponse() {
        String rUuid = UUID.randomUUID().toString();
        when(loanRepository.findById(rUuid)).thenReturn(Optional.empty());
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(30)
                .fullName("John Doe")
                .monthlyIncome(20000)
                .loanAmount(100000)
                .loanPurpose("home")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .build();

        LoanEntity savedEntity = LoanEntity.builder()
                .id(rUuid)
                .eligible(true)
                .reason("Eligible under base rules")
                .createdDate(LocalDateTime.now())
                .build();

        when(loanRepository.saveAndFlush(any(LoanEntity.class))).thenReturn(savedEntity);

        LoanServiceResponse response = loanService.loanSubmit(request);

        Assertions.assertTrue(response.getEligible());
        Assertions.assertEquals("Eligible under base rules", response.getReason());
        Assertions.assertEquals(rUuid, response.getApplicationId());
    }
    @Test
    void loanSubmitInvalidAgeThrowsApiException() {
        String rUuid = UUID.randomUUID().toString();
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(65)
                .fullName("John Doe")
                .monthlyIncome(20000)
                .loanAmount(100000)
                .loanPurpose("home")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .build();

        LoanEntity savedEntity = LoanEntity.builder()
                .id(rUuid)
                .eligible(false)
                .reason("Age not in range (must be between 20-60)")
                .createdDate(LocalDateTime.now())
                .build();
        when(loanRepository.saveAndFlush(any(LoanEntity.class))).thenReturn(savedEntity);

        LoanServiceResponse response = loanService.loanSubmit(request);
        Assertions.assertFalse(response.getEligible());
        Assertions.assertEquals("Age not in range (must be between 20-60)", response.getReason());

    }
    @Test
    void loanSubmitInvalidMonthlyIncomeThrowsApiException() {
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(30)
                .fullName("John Doe")
                .monthlyIncome(4000)
                .loanAmount(100000)
                .loanPurpose("home")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .build();

        ApiException exception = Assertions.assertThrows(ApiException.class, () -> loanService.loanSubmit(request));

        Assertions.assertEquals("Monthly income must be between 5,000 and 5,000,000", exception.getReason());
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }
    @Test
    void loanSubmitInvalidLoanPurposeThrowsApiException() {
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(30)
                .fullName("John Doe")
                .monthlyIncome(20000)
                .loanAmount(100000)
                .loanPurpose("invalid-purpose")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .build();

        ApiException exception = Assertions.assertThrows(ApiException.class, () -> loanService.loanSubmit(request));

        Assertions.assertEquals("Loan purpose must be one of: education, home, car, business, personal", exception.getReason());
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }
    @Test
    void loanSubmitInvalidPhoneNumberThrowsApiException() {
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(30)
                .fullName("John Doe")
                .monthlyIncome(20000)
                .loanAmount(100000)
                .loanPurpose("home")
                .email("john.doe@example.com")
                .phoneNumber("invalid-phone")
                .build();

        ApiException exception = Assertions.assertThrows(ApiException.class, () -> loanService.loanSubmit(request));

        Assertions.assertEquals("Phone number must be numeric", exception.getReason());
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }
    @Test
    void loanSubmitInvalidEmailThrowsApiException() {
        LoanServiceRequest request = LoanServiceRequest.builder()
                .age(30)
                .fullName("John Doe")
                .monthlyIncome(20000)
                .loanAmount(100000)
                .loanPurpose("home")
                .email("invalid-email")
                .phoneNumber("1234567890")
                .build();

        ApiException exception = Assertions.assertThrows(ApiException.class, () -> loanService.loanSubmit(request));

        Assertions.assertEquals("Email must be a valid email address", exception.getReason());
        Assertions.assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }
}