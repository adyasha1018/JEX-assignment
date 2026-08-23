import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Vacancy } from '../../../core/models/vacancy.model';
import { AppDataService } from '../../../core/services/app-data.service';
import { AppErrorService } from '../../../core/services/app-error.service';
import { VacancyService } from '../../../core/services/vacancy.service';

@Component({
  selector: 'app-vacancy-list',
  imports: [RouterLink],
  templateUrl: './vacancy-list.component.html',
  styleUrl: './vacancy-list.component.scss',
})
export class VacancyListComponent implements OnInit {
  private readonly vacancyService = inject(VacancyService);

  private readonly appData = inject(AppDataService);

  private readonly appError = inject(AppErrorService);

  readonly vacancies = this.appData.vacancies;

  readonly companies = this.appData.companies;

  readonly loading = this.appData.loading;

  readonly error = this.appData.error;

  ngOnInit(): void {
    this.appData.loadCompanies();
    this.appData.loadVacancies();
  }

  getCompanyName(companyId: string): string {
    const company = this.companies().find((item) => item.id === companyId);

    return company?.name ?? 'Unknown company';
  }

  deleteVacancy(vacancy: Vacancy): void {
    const confirmed = window.confirm(`Are you sure you want to delete "${vacancy.title}"?`);

    if (!confirmed) {
      return;
    }

    this.vacancyService.deleteVacancy(vacancy.id).subscribe({
      next: () => {
        this.vacancies.update((vacancies) => vacancies.filter((item) => item.id !== vacancy.id));
      },

      error: (error) => {
        console.error('Failed to delete vacancy:', error);

        this.error.set(this.appError.messageFromError(error, 'Unable to delete the vacancy.'));
      },
    });
  }
}
