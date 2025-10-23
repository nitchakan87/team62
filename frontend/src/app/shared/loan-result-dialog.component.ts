import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loan-result-dialog',
  templateUrl: './loan-result-dialog.component.html',
  styleUrls: ['./loan-result-dialog.component.scss']
})
export class LoanResultDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LoanResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { eligible: boolean; reason: string }
  ) {}
}
