import {
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  distinctUntilChanged
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import { CompanyService } from '../../../core/services/company.service';
import { VacancyService } from '../../../core/services/vacancy.service';

import { Company } from '../../../core/models/company.model';
import { Vacancy } from '../../../core/models/vacancy.model';

@Component({
  selector: 'app-company-vacancies',
  imports: [RouterLink],
  templateUrl: './company-vacancies.component.html',
  styleUrl: './company-vacancies.component.scss'
})
export class CompanyVacanciesComponent {
  private readonly route =
    inject(ActivatedRoute);

  private readonly companyService =
    inject(CompanyService);

  private readonly vacancyService =
    inject(VacancyService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly company =
    signal<Company | null>(null);

  readonly vacancies =
    signal<Vacancy[]>([]);

  readonly companyId =
    signal<string | null>(null);

  readonly loading =
    signal(true);

  readonly error =
    signal('');

  constructor() {
    this.route.paramMap
      .pipe(
        distinctUntilChanged(
          (previous, current) =>
            previous.get('companyId') ===
            current.get('companyId')
        ),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(params => {
        const companyId =
          params.get('companyId');

        console.log(
          'Route companyId:',
          companyId
        );

        if (!companyId) {
          this.error.set(
            'Company could not be identified.'
          );

          this.loading.set(false);

          return;
        }

        this.companyId.set(companyId);

        this.loadCompany(companyId);
        this.loadVacancies(companyId);
      });
  }

  private loadCompany(
    companyId: string
  ): void {
    this.companyService
      .getCompany(companyId)
      .subscribe({
        next: company => {
          this.company.set(company);
        },

        error: error => {
          console.error(
            'Failed to load company:',
            error
          );

          this.error.set(
            'Unable to load company.'
          );
        }
      });
  }

 private loadVacancies(
  companyId: string
): void {
  this.loading.set(true);
  this.error.set('');

  this.vacancyService
    .getVacanciesByCompany(companyId)
    .subscribe({
      next: vacancies => {
        console.log(
          'Vacancies for:',
          companyId,
          vacancies
        );

        this.vacancies.set(vacancies);
        this.loading.set(false);
      },

      error: error => {
        console.error(
          'Failed to load vacancies:',
          error
        );

        this.error.set(
          'Unable to load vacancies.'
        );

        this.loading.set(false);
      }
    });
}

  deleteVacancy(
    vacancy: Vacancy
  ): void {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${vacancy.title}"?`
      );

    if (!confirmed) {
      return;
    }

    this.vacancyService
      .deleteVacancy(vacancy.id)
      .subscribe({
        next: () => {
          this.vacancies.update(
            vacancies =>
              vacancies.filter(
                item =>
                  item.id !== vacancy.id
              )
          );
        },

        error: error => {
          console.error(
            'Failed to delete vacancy:',
            error
          );

          this.error.set(
            'Unable to delete vacancy.'
          );
        }
      });
  }
}
