package com.example.mini_project.loan.controller;

import com.example.mini_project.loan.service.LoanService;
import com.example.mini_project.loan.service.model.LoanServiceRequest;
import com.example.mini_project.loan.service.model.LoanServiceResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:30080")
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/loans")
    public ResponseEntity<LoanServiceResponse> submitLoan (@Valid  @RequestBody LoanServiceRequest request){
        return  ResponseEntity.ok(loanService.loanSubmit(request));
    }

}
