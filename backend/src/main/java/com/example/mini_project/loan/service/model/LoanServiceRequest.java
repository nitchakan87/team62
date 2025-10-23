package com.example.mini_project.loan.service.model;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanServiceRequest {
    @NotNull
    private String fullName;
    @NotNull
    private Integer monthlyIncome;
    @NotNull
    private Integer loanAmount;
    @NotNull
    private String loanPurpose;
    @NotNull
    private Integer age;
    @NotNull
    private String phoneNumber;
    @NotNull
    private String email;

}
