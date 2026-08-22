import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VacancyService } from '../../../core/services/vacancy.service';
import { CompanyService } from '../../../core/services/company.service';
import { Vacancy } from '../../../core/models/vacancy.model';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-vacancy-list',
  imports: [RouterLink],
  templateUrl: './vacancy-list.component.html',
  styleUrl: './vacancy-list.component.scss'
})
export class VacancyListComponent {
  private readonly vacancyService = inject(VacancyService);
  private readonly companyService = inject(CompanyService);

  readonly vacancies = signal<Vacancy[]>([]);
  readonly companies = signal<Company[]>([]);

  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadCompanies();
    this.loadVacancies();
  }

  private loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: companies => {
        this.companies.set(companies);
      },

      error: error => {
        console.error('Failed to load companies:', error);
      }
    });
  }

  private loadVacancies(): void {
    this.loading.set(true);
    this.error.set('');

    this.vacancyService.getVacancies().subscribe({
      next: vacancies => {
        this.vacancies.set(vacancies);
        this.loading.set(false);
      },

      error: error => {
        console.error('Failed to load vacancies:', error);

        this.error.set('Unable to load vacancies.');
        this.loading.set(false);
      }
    });
  }

  getCompanyName(companyId: string): string {
    const company = this.companies().find(
      item => item.id === companyId
    );

    return company?.name ?? 'Unknown company';
  }

  deleteVacancy(vacancy: Vacancy): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${vacancy.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.vacancyService.deleteVacancy(vacancy.id).subscribe({
      next: () => {
        this.vacancies.update(vacancies =>
          vacancies.filter(
            item => item.id !== vacancy.id
          )
        );
      },

      error: error => {
        console.error(
          'Failed to delete vacancy:',
          error
        );

        this.error.set('Unable to delete the vacancy.');
      }
    });
  }
}
