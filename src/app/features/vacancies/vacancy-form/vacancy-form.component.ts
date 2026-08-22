import {
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  distinctUntilChanged
} from 'rxjs';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import { VacancyService } from '../../../core/services/vacancy.service';
import { CompanyService } from '../../../core/services/company.service';

import { Vacancy } from '../../../core/models/vacancy.model';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-vacancy-form',
  imports: [ReactiveFormsModule],
  templateUrl: './vacancy-form.component.html',
  styleUrl: './vacancy-form.component.scss'
})
export class VacancyFormComponent {
  private readonly fb = inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly vacancyService =
    inject(VacancyService);

  private readonly companyService =
    inject(CompanyService);

  private readonly destroyRef =
    inject(DestroyRef);

  readonly companyId =
    signal<string | null>(null);

  readonly vacancyId =
    signal<string | null>(null);

  readonly company =
    signal<Company | null>(null);

  readonly loading =
    signal(false);

  readonly saving =
    signal(false);

  readonly error =
    signal('');

  readonly vacancyForm =
    this.fb.nonNullable.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

  get isEditMode(): boolean {
    return this.vacancyId() !== null;
  }

  get pageTitle(): string {
    return this.isEditMode
      ? 'Edit vacancy'
      : 'Add vacancy';
  }

  constructor() {
    this.route.paramMap
      .pipe(
        distinctUntilChanged(
          (previous, current) =>
            previous.get('companyId') ===
              current.get('companyId') &&
            previous.get('vacancyId') ===
              current.get('vacancyId')
        ),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(params => {
        const companyId =
          params.get('companyId');

        const vacancyId =
          params.get('vacancyId');

        this.companyId.set(companyId);
        this.vacancyId.set(vacancyId);

        this.error.set('');

        if (!companyId) {
          this.error.set(
            'Company could not be identified.'
          );

          return;
        }

        // Load company information
        this.loadCompany(companyId);

        // CREATE
        if (!vacancyId) {
          this.resetForm();
          this.loading.set(false);
          return;
        }

        // EDIT
        this.loadVacancy(vacancyId);
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

  private loadVacancy(
    vacancyId: string
  ): void {
    this.loading.set(true);

    this.vacancyService
      .getVacancy(vacancyId)
      .subscribe({
        next: vacancy => {
          this.vacancyForm.setValue({
            title: vacancy.title,
            description: vacancy.description
          });

          this.loading.set(false);
        },

        error: error => {
          console.error(
            'Failed to load vacancy:',
            error
          );

          this.error.set(
            'Unable to load vacancy.'
          );

          this.loading.set(false);
        }
      });
  }

  submit(): void {
    if (this.vacancyForm.invalid) {
      this.vacancyForm.markAllAsTouched();
      return;
    }

    const companyId =
      this.companyId();

    if (!companyId) {
      this.error.set(
        'Company could not be identified.'
      );

      return;
    }

    this.saving.set(true);
    this.error.set('');

    const formValue =
      this.vacancyForm.getRawValue();

    if (this.isEditMode) {
      this.updateVacancy(
        formValue,
        companyId
      );
    } else {
      this.createVacancy(
        formValue,
        companyId
      );
    }
  }

  private createVacancy(
    data: {
      title: string;
      description: string;
    },
    companyId: string
  ): void {
    const vacancy: Omit<Vacancy, 'id'> = {
      title: data.title,
      description: data.description,
      companyId
    };

    this.vacancyService
      .createVacancy(vacancy)
      .subscribe({
        next: () => {
          this.router.navigate([
            '/companies',
            companyId,
            'vacancies'
          ]);
        },

        error: error => {
          console.error(
            'Failed to create vacancy:',
            error
          );

          this.error.set(
            'Unable to create vacancy.'
          );

          this.saving.set(false);
        }
      });
  }

  private updateVacancy(
    data: {
      title: string;
      description: string;
    },
    companyId: string
  ): void {
    const vacancyId =
      this.vacancyId();

    if (!vacancyId) {
      return;
    }

    const vacancy: Vacancy = {
      id: vacancyId,
      title: data.title,
      description: data.description,
      companyId
    };

    this.vacancyService
      .updateVacancy(vacancy)
      .subscribe({
        next: () => {
          this.router.navigate([
            '/companies',
            companyId,
            'vacancies'
          ]);
        },

        error: error => {
          console.error(
            'Failed to update vacancy:',
            error
          );

          this.error.set(
            'Unable to update vacancy.'
          );

          this.saving.set(false);
        }
      });
  }

  cancel(): void {
    const companyId =
      this.companyId();

    if (companyId) {
      this.router.navigate([
        '/companies',
        companyId,
        'vacancies'
      ]);

      return;
    }

    this.router.navigate([
      '/companies'
    ]);
  }

  private resetForm(): void {
    this.vacancyForm.reset({
      title: '',
      description: ''
    });
  }
}
