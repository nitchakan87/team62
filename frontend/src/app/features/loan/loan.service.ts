import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvService } from "../../../app-config.service";

export interface LoanRequest {
  fullName: string;
  phoneNumber: string;
  monthlyIncome: number;
  loanAmount: number;
  loanPurpose: string;
  age: number;
  email: string;
}

export interface LoanResponse {
  applicationId: string;
  eligible: boolean;
  reason: string;
  timestamp: string;
}

@Injectable({ providedIn: "root" })
export class LoanService {
  constructor(private http: HttpClient, private env: EnvService) {}

  apply(payload: LoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(
      `http://localhost:30090/api/v1/loans`,
      payload
    );
  }
}
