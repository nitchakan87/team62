package com.example.mini_project.loan.service;


import ch.qos.logback.core.util.StringUtil;
import com.example.mini_project.loan.entity.LoanEntity;
import com.example.mini_project.loan.repository.LoanRepository;
import com.example.mini_project.loan.service.model.LoanServiceRequest;
import com.example.mini_project.loan.service.model.LoanServiceResponse;
import com.example.mini_project.util.ApiException;
import com.example.mini_project.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;


    public LoanServiceResponse loanSubmit(LoanServiceRequest request) {
        System.out.println(request);
        validateRequest(request);
        LoanEntity insertData = LoanEntity.builder()
                .age(request.getAge())
                .fullName(request.getFullName())
                .monthlyIncome(request.getMonthlyIncome())
                .loanAmount(request.getLoanAmount())
                .loanPurpose(request.getLoanPurpose())
                .createdDate(LocalDateTime.now())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .build();
        if(request.getMonthlyIncome() < 10000){
            insertData.setEligible(false);
            insertData.setReason("Monthly income is insufficient");
        }else if(request.getAge() < 20 || request.getAge() > 60){
            insertData.setEligible(false);
            insertData.setReason("Age not in range (must be between 20-60)");
        }else if(request.getLoanPurpose().equals("business")){
            insertData.setEligible(false);
            insertData.setReason("Business loans not supported");
        }else if(request.getLoanAmount() <= (12*  request.getMonthlyIncome())){
            insertData.setEligible(false);
            insertData.setReason("Loan amount cannot exceed 12 months of income");
        }else {
            insertData.setEligible(true);
            insertData.setReason("Eligible under base rules");
        }


        LoanEntity resultFromInsert = loanRepository.saveAndFlush(insertData);

        return LoanServiceResponse.builder()
                .applicationId(resultFromInsert.getId())
                .eligible(resultFromInsert.getEligible())
                .reason(resultFromInsert.getReason())
                .timestamp(resultFromInsert.getCreatedDate())
                .build();
    }

    private void validateRequest(LoanServiceRequest request){

        if(request.getFullName().length() <2 || request.getLoanPurpose().length() > 255){
            throw new ApiException("Invalid request body","Full name must be between 2 and 255 characters", HttpStatus.BAD_REQUEST);
        }else if(request.getMonthlyIncome() < 5000 || request.getMonthlyIncome() > 5000000) {
            throw new ApiException("Invalid request body", "Monthly income must be between 5,000 and 5,000,000", HttpStatus.BAD_REQUEST);
        }else if(request.getLoanAmount() < 1000 || request.getLoanAmount() > 5000000){
            throw new ApiException("Invalid request body", "Loan amount must be between 1,000 and 5,000,000", HttpStatus.BAD_REQUEST);
        }else if(!Constants.LOAN_PURPOSE_LIST.contains(request.getLoanPurpose())){
            throw new ApiException("Invalid request body", "Loan purpose must be one of: education, home, car, business, personal", HttpStatus.BAD_REQUEST);
        }else if(request.getAge() < 1){
            throw new ApiException("Invalid request body", "Age must be a number more than 0", HttpStatus.BAD_REQUEST);
        }else if(!request.getPhoneNumber().matches("^[0-9]+$")){
            throw new ApiException("Invalid request body", "Phone number must be numeric", HttpStatus.BAD_REQUEST);
        }else if(!(request.getPhoneNumber().length() == 10)){
            throw new ApiException("Invalid request body", "Phone number must be 10 digits", HttpStatus.BAD_REQUEST);
        }else if(!request.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")){
            throw new ApiException("Invalid request body", "Email must be a valid email address", HttpStatus.BAD_REQUEST);
        }


    }
}
