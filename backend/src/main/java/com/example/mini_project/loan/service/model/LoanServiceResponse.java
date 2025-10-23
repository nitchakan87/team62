package com.example.mini_project.loan.service.model;


import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanServiceResponse {

    private String applicationId;
    private Boolean eligible;
    private String reason;
    private LocalDateTime timestamp;



}
