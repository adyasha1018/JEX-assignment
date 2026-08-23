import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Company } from '../../../core/models/company.model';
import { AppDataService } from '../../../core/services/app-data.service';
import { AppErrorService } from '../../../core/services/app-error.service';
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: 'app-company-list',
  imports: [RouterLink],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss',
})
export class CompanyListComponent {
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);
  private readonly appData = inject(AppDataService);
  private readonly appError = inject(AppErrorService);

  readonly companies = this.appData.companies;
  readonly vacancies = this.appData.vacancies;
  readonly searchTerm = signal('');
  readonly loading = this.appData.loading;
  readonly error = this.appData.error;
  readonly companiesWithVacancies = this.appData.companiesWithVacancies;
  readonly vacancyCountByCompany = this.appData.vacancyCountByCompany;

  /**
   * Companies displayed after applying
   * the search filter.
   */
  readonly filteredCompanies = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    const companies = this.companiesWithVacancies();

    if (!search) {
      return companies;
    }

    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(search) ||
        company.address.toLowerCase().includes(search),
    );
  });

  constructor() {
    this.appData.loadCompaniesAndVacancies();
  }

  getVacancyCount(companyId: string): number {
    return this.vacancyCountByCompany().get(String(companyId)) ?? 0;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  addCompany(): void {
    this.router.navigate(['/companies/new']);
  }

  editCompany(company: Company): void {
    this.router.navigate(['/companies', company.id, 'edit']);
  }

  viewVacancies(company: Company): void {
    this.router.navigate(['/companies', company.id, 'vacancies']);
  }

  deleteCompany(company: Company): void {
    const vacancyCount = this.getVacancyCount(company.id);

    if (vacancyCount > 0) {
      window.alert(
        `Cannot delete "${company.name}" because it has ${vacancyCount} active ${
          vacancyCount === 1 ? 'vacancy' : 'vacancies'
        }.`,
      );
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${company.name}"?`);

    if (!confirmed) {
      return;
    }

    this.companyService.deleteCompany(company.id).subscribe({
      next: () => {
        this.companies.update((companies) => companies.filter((item) => item.id !== company.id));
      },
      error: (error) => {
        console.error('Failed to delete company:', error);
        this.error.set(this.appError.messageFromError(error, 'Unable to delete the company.'));
      },
    });
  }
}
