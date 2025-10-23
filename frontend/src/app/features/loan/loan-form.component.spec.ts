import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoanFormComponent } from "./loan-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { LoanService, LoanResponse, LoanRequest } from "./loan.service";
import { of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { throwError } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

describe("LoanFormComponent", () => {
  let component: LoanFormComponent;
  let fixture: ComponentFixture<LoanFormComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockLoanService: jasmine.SpyObj<LoanService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj("MatDialog", ["open"]);
    mockLoanService = jasmine.createSpyObj("LoanService", ["apply"]);

    await TestBed.configureTestingModule({
      declarations: [LoanFormComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatOptionModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
      ], // ป้องกัน dialog จริงเด้ง
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LoanService, useValue: mockLoanService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("ควรสร้าง component สำเร็จ", () => {
    expect(component).toBeTruthy();
  });

  it("ควรเปิด dialog ถ้า loanAmount มากกว่า 12 เท่าของรายได้", () => {
    component.loanForm.setValue({
      fullName: "สมชาย",
      phoneNumber: "0891234567",
      monthlyIncome: 10000,
      loanAmount: 150000,
      loanPurpose: "home",
      age: 30,
      email: "test@example.com",
    });

    component.submit();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          eligible: false,
          reason: jasmine.stringMatching(/12 months/i),
        }),
      })
    );
  });

  // ส่วนต่อจาก describe เดิม
  it("ควรเรียก loanService.apply() และเปิด dialog เมื่อฟอร์ม valid และไม่เกิน 12 เท่ารายได้", () => {
    mockLoanService.apply.and.returnValue(
      of({
        applicationId: "12345",
        eligible: true,
        reason: "Approved",
        timestamp: "2025-07-21T00:00:00Z",
      })
    );

    component.loanForm.setValue({
      fullName: "สมชาย",
      phoneNumber: "0891234567",
      monthlyIncome: 10000,
      loanAmount: 100000, // = 10 เท่า
      loanPurpose: "home",
      age: 30,
      email: "test@example.com",
    });

    component.submit();

    expect(mockLoanService.apply).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          eligible: true,
          reason: "Approved",
        }),
      })
    );
  });

  it("ควรเปิด dialog error เมื่อ loanService.apply() เกิด error", () => {
    mockLoanService.apply.and.returnValue(
      throwError(() => new Error("mock error"))
    );

    component.loanForm.setValue({
      fullName: "สมชาย",
      phoneNumber: "0891234567",
      monthlyIncome: 10000,
      loanAmount: 100000,
      loanPurpose: "home",
      age: 30,
      email: "test@example.com",
    });

    component.submit();

    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          eligible: false,
          reason: jasmine.stringMatching(/Submission failed/i),
        }),
      })
    );
  });

  it("ควร markAllAsTouched เมื่อฟอร์มไม่ valid", () => {
    spyOn(component.loanForm, "markAllAsTouched");

    component.loanForm.patchValue({
      fullName: "", // required
    });

    component.submit();

    expect(component.loanForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockLoanService.apply).not.toHaveBeenCalled();
    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it("ควร reset ฟอร์มและล้าง response", () => {
    component.loanForm.patchValue({
      fullName: "ทดสอบ",
      email: "a@b.com",
    });
    component.response = {
      applicationId: "A1",
      eligible: true,
      reason: "OK",
      timestamp: "2025-07-21T00:00:00Z",
    };

    component.resetForm();

    expect(component.loanForm.get("fullName")?.value).toBeNull();
    expect(component.response).toBeNull();
  });

  it("ควรเรียก markAllAsTouched ถ้า form ไม่ valid", () => {
    const markSpy = spyOn(component.loanForm, "markAllAsTouched");
    component.loanForm.patchValue({ fullName: "" }); // invalid form
    component.submit();
    expect(markSpy).toHaveBeenCalled();
  });

  it("ควร reset form และล้าง response เมื่อ resetForm ถูกเรียก", () => {
    component.response = {
      applicationId: "A1",
      eligible: true,
      reason: "OK",
      timestamp: "2025-07-21T00:00:00Z",
    };
    component.loanForm.patchValue({ fullName: "test" });
    component.resetForm();
    expect(component.loanForm.value.fullName).toBeNull();
    expect(component.response).toBeNull();
  });

  it("ควร markAllAsTouched เมื่อฟอร์มไม่ valid", () => {
    spyOn(component.loanForm, "markAllAsTouched");

    component.loanForm.patchValue({
      fullName: "", // invalid
      email: "", // invalid
    });

    component.submit();

    expect(component.loanForm.markAllAsTouched).toHaveBeenCalled();
  });

  it("ควรเรียก markAllAsTouched ถ้า form ไม่ valid", () => {
    spyOn(component.loanForm, "markAllAsTouched");

    // set invalid data
    component.loanForm.patchValue({
      fullName: "", // required
      email: "invalid-email", // invalid
    });

    component.submit();

    expect(component.loanForm.markAllAsTouched).toHaveBeenCalled();
  });

});
