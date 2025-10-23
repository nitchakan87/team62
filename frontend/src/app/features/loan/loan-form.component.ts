import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { LoanService, LoanRequest, LoanResponse } from "./loan.service";
import { MatDialog } from "@angular/material/dialog";
import { LoanResultDialogComponent } from "../../shared/loan-result-dialog.component";

@Component({
  selector: "app-loan-form",
  templateUrl: "./loan-form.component.html",
  styleUrls: ["./loan-form.component.scss"],
})
export class LoanFormComponent {
  loanForm: FormGroup;
  isSubmitting = false;
  response: LoanResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private dialog: MatDialog
  ) {
    this.loanForm = this.fb.group({
      fullName: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(255),
        ],
      ],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(0[689]\d{8}|0[23457]\d{7})$/),
        ],
      ],
      monthlyIncome: [
        "",
        [Validators.required, Validators.min(5000), Validators.max(5000000)],
      ],
      loanAmount: [
        "",
        [Validators.required, Validators.min(1000), Validators.max(5000000)],
      ],
      loanPurpose: ["", [Validators.required]],
      age: [
        "",
        [Validators.required, Validators.min(20), Validators.max(100)], // ต้องมากกว่า 0
      ],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.isSubmitting) return;

    if (this.loanForm.valid) {
      const data: LoanRequest = this.loanForm.value;

      if (data.loanAmount > 12 * data.monthlyIncome) {
        this.dialog.open(LoanResultDialogComponent, {
          data: {
            eligible: false,
            reason: "Loan amount cannot exceed 12 months of income",
          },
        });
        return;
      }

      this.isSubmitting = true;
      this.loanService.apply(data).subscribe({
        next: (res) => {
          this.response = res;
          this.dialog.open(LoanResultDialogComponent, {
            data: res,
          });
        },
        error: (err) => {
          console.error(err);
          this.dialog.open(LoanResultDialogComponent, {
            data: {
              eligible: false,
              reason: "Submission failed. Please try again.",
            },
          });
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.loanForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.loanForm.reset();
    this.response = null;
  }
}
