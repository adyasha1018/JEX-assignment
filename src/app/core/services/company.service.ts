import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/companies';

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  createCompany(company: Omit<Company, 'id'>): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

getCompany(id: string): Observable<Company> {
  return this.http.get<Company>(`${this.apiUrl}/${id}`);
}

updateCompany(company: Company): Observable<Company> {
  return this.http.put<Company>(
    `${this.apiUrl}/${company.id}`,
    company
  );
}


  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
