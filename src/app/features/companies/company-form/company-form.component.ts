import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, of, switchMap } from 'rxjs';

import { AppErrorService } from '../../../core/services/app-error.service';
import { CompanyService } from '../../../core/services/company.service';
import { areRouteParamsEqual, getRouteParam } from '../../../shared/utils/route-entity';

@Component({
  selector: 'app-company-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly appError = inject(AppErrorService);

  readonly companyForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
  });

  readonly companyId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  constructor() {
    this.route.paramMap
      .pipe(
        distinctUntilChanged((previous, current) =>
          areRouteParamsEqual(previous, current, ['companyId']),
        ),
        switchMap((params) => {
          const companyId = getRouteParam(params, 'companyId');

          this.companyId.set(companyId);
          this.error.set('');

          if (!companyId) {
            this.resetForm();
            this.loading.set(false);
            return of(null);
          }

          this.loading.set(true);
          return this.companyService.getCompany(companyId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (company) => {
          if (!company) {
            return;
          }

          this.companyForm.setValue({
            name: company.name,
            address: company.address,
          });
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load company:', error);
          this.error.set(this.appError.messageFromError(error, 'Unable to load the company.'));
          this.loading.set(false);
        },
      });
  }

  get isEditMode(): boolean {
    return this.companyId() !== null;
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const data = this.companyForm.getRawValue();

    if (this.companyId() === null) {
      this.createCompany(data);
    } else {
      this.updateCompany(data);
    }
  }

  private createCompany(data: { name: string; address: string }): void {
    this.companyService.createCompany(data).subscribe({
      next: () => {
        this.router.navigate(['/companies']);
      },
      error: (error) => {
        console.error('Failed to create company:', error);
        this.error.set(this.appError.messageFromError(error, 'Unable to create the company.'));
        this.saving.set(false);
      },
    });
  }

  private updateCompany(data: { name: string; address: string }): void {
    const id = this.companyId();

    if (!id) {
      return;
    }

    const company = {
      id,
      name: data.name,
      address: data.address,
    };

    this.companyService.updateCompany(company).subscribe({
      next: () => {
        this.router.navigate(['/companies']);
      },
      error: (error) => {
        console.error('Failed to update company:', error);
        this.error.set(this.appError.messageFromError(error, 'Unable to update the company.'));
        this.saving.set(false);
      },
    });
  }

  private resetForm(): void {
    this.companyForm.reset({
      name: '',
      address: '',
    });

    this.saving.set(false);
    this.error.set('');
  }
}
