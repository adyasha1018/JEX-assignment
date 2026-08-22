import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-company-list',
  imports: [RouterLink],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent {
  private readonly companyService = inject(CompanyService);

  readonly companies = signal<Company[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.error.set('');

    this.companyService.getCompanies().subscribe({
      next: companies => {
        this.companies.set(companies);
        this.loading.set(false);
      },

      error: error => {
        console.error('Failed to load companies:', error);

        this.error.set('Unable to load companies.');
        this.loading.set(false);
      }
    });
  }

  deleteCompany(company: Company): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${company.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.companyService.deleteCompany(company.id).subscribe({
      next: () => {
        this.companies.update(companies =>
          companies.filter(item => item.id !== company.id)
        );
      },

      error: error => {
        console.error('Failed to delete company:', error);

        this.error.set('Unable to delete the company.');
      }
    });
  }
}
