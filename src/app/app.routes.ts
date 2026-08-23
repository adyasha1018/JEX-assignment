import { Routes } from '@angular/router';

export const routes: Routes = [
{
  path: 'companies',
  loadComponent: () =>
    import('./features/companies/company-list/company-list.component')
      .then(m => m.CompanyListComponent)
},
{
  path: 'companies/new',
  loadComponent: () =>
    import('./features/companies/company-form/company-form.component')
      .then(m => m.CompanyFormComponent)
},
{
  path: 'companies/:companyId/edit',
  loadComponent: () =>
    import('./features/companies/company-form/company-form.component')
      .then(m => m.CompanyFormComponent)
},
{
  path: 'companies/:companyId/vacancies',
  loadComponent: () =>
    import('./features/companies/company-vacancies/company-vacancies.component')
      .then(m => m.CompanyVacanciesComponent)
},
{
  path: 'companies/:companyId/vacancies/new',
  loadComponent: () =>
    import('./features/vacancies/vacancy-form/vacancy-form.component')
      .then(m => m.VacancyFormComponent)
},
{
  path: 'companies/:companyId/vacancies/:vacancyId/edit',
  loadComponent: () =>
    import('./features/vacancies/vacancy-form/vacancy-form.component')
      .then(m => m.VacancyFormComponent)
},

{
  path: 'vacancies',
  loadComponent: () =>
    import('./features/vacancies/vacancy-list/vacancy-list.component')
      .then(m => m.VacancyListComponent)
},
{
  path: 'vacancies/new',
  loadComponent: () =>
    import('./features/vacancies/vacancy-form/vacancy-form.component')
      .then(m => m.VacancyFormComponent)
},
{
  path: 'vacancies/:vacancyId/edit',
  loadComponent: () =>
    import('./features/vacancies/vacancy-form/vacancy-form.component')
      .then(m => m.VacancyFormComponent)
},

  {
    path: '**',
    redirectTo: 'companies',
  },
];
