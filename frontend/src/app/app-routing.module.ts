import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanFormComponent } from 'src/app/features/loan/loan-form.component';

const routes: Routes = [
  { path: 'loan', component: LoanFormComponent },
  { path: '', redirectTo: 'loan', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}