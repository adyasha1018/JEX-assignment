import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Vacancy } from '../models/vacancy.model';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/vacancies';

  getVacancies(): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(
      this.apiUrl
    );
  }

  getVacanciesByCompany(
    companyId: string
  ): Observable<Vacancy[]> {
    return this.getVacancies().pipe(
      map(vacancies =>
        vacancies.filter(
          vacancy =>
            String(vacancy.companyId) ===
            String(companyId)
        )
      )
    );
  }

  getVacancy(
    vacancyId: string
  ): Observable<Vacancy> {
    return this.http.get<Vacancy>(
      `${this.apiUrl}/${encodeURIComponent(vacancyId)}`
    );
  }

  createVacancy(
    vacancy: Omit<Vacancy, 'id'>
  ): Observable<Vacancy> {
    return this.http.post<Vacancy>(
      this.apiUrl,
      vacancy
    );
  }

  updateVacancy(
    vacancy: Vacancy
  ): Observable<Vacancy> {
    return this.http.put<Vacancy>(
      `${this.apiUrl}/${encodeURIComponent(vacancy.id)}`,
      vacancy
    );
  }

  deleteVacancy(
    vacancyId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${encodeURIComponent(vacancyId)}`
    );
  }
}
