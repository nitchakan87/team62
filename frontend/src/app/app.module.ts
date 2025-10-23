import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./../app/app-routing.module";
import { AppComponent } from "./../app/app.component";
import { LoanFormComponent } from "./features/loan/loan-form.component";
import { LoanResultDialogComponent } from "./shared/loan-result-dialog.component";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AppComponent, LoanFormComponent,LoanResultDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
