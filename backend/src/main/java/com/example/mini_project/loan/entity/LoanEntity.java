package com.example.mini_project.loan.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Loan")
public class LoanEntity {

    @Id
    @GeneratedValue(generator = "uuid4")
    @GenericGenerator(name = "uuid4", strategy = "uuid2")
    @Column(name = "id", nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String id;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "monthly_income")
    private Integer monthlyIncome;
    @Column(name = "loan_amount")
    private Integer loanAmount;
    @Column(name = "loan_purpose")
    private String loanPurpose;
    @Column(name = "age")
    private Integer age;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "email")
    private String email;
    @Column(name = "eligible")
    private Boolean eligible;
    @Column(name = "reason")
    private String reason;
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
}
