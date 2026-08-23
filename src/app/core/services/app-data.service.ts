import { computed, inject, Injectable, signal } from '@angular/core';
import { EMPTY, forkJoin, finalize } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Company } from '../models/company.model';
import { Vacancy } from '../models/vacancy.model';
import { AppErrorService } from './app-error.service';
import { CompanyService } from './company.service';
import { VacancyService } from './vacancy.service';

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  private readonly companyService = inject(CompanyService);

  private readonly vacancyService = inject(VacancyService);

  private readonly appError = inject(AppErrorService);

  readonly companies = signal<Company[]>([]);

  readonly vacancies = signal<Vacancy[]>([]);

  readonly loading = signal(false);

  readonly error = signal('');

  readonly companiesWithVacancies = computed(() => {
    const companyIds = new Set(this.vacancies().map((vacancy) => String(vacancy.companyId)));

    return this.companies().filter((company) => companyIds.has(String(company.id)));
  });

  readonly vacancyCountByCompany = computed(() => {
    const counts = new Map<string, number>();

    for (const vacancy of this.vacancies()) {
      const companyId = String(vacancy.companyId);
      counts.set(companyId, (counts.get(companyId) ?? 0) + 1);
    }

    return counts;
  });

  loadCompaniesAndVacancies(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      companies: this.companyService.getCompanies(),
      vacancies: this.vacancyService.getVacancies(),
    })
      .pipe(
        tap(({ companies, vacancies }) => {
          this.companies.set(companies);
          this.vacancies.set(vacancies);
        }),
        catchError((error) => {
          this.error.set(this.appError.messageFromError(error, 'Unable to load companies.'));

          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.error.set('');

    this.companyService
      .getCompanies()
      .pipe(
        tap((companies) => this.companies.set(companies)),
        catchError((error) => {
          this.error.set(this.appError.messageFromError(error, 'Unable to load companies.'));

          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  loadVacancies(): void {
    this.loading.set(true);
    this.error.set('');

    this.vacancyService
      .getVacancies()
      .pipe(
        tap((vacancies) => this.vacancies.set(vacancies)),
        catchError((error) => {
          this.error.set(this.appError.messageFromError(error, 'Unable to load vacancies.'));

          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
