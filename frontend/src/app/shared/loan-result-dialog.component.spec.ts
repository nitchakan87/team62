import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanResultDialogComponent } from './loan-result-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('LoanResultDialogComponent', () => {
  let component: LoanResultDialogComponent;
  let fixture: ComponentFixture<LoanResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanResultDialogComponent],
      imports: [
        MatDialogModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { eligible: false, reason: 'Mock Reason' }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ควรสร้าง component ได้', () => {
    expect(component).toBeTruthy();
  });

  it('ควรแสดงข้อความ reject ถ้าไม่ผ่าน', () => {
    const contentEl = fixture.debugElement.query(By.css('.rejected')).nativeElement;
    expect(contentEl.textContent).toContain('Not eligible: Mock Reason');
  });

  it('ควรแสดงข้อความ success ถ้า eligible = true', () => {
    component.data.eligible = true;
    fixture.detectChanges();

    const successText = fixture.debugElement.query(By.css('mat-dialog-content p')).nativeElement.textContent;
    expect(successText).toContain("You're eligible for the loan!");
  });
});