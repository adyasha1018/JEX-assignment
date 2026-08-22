import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },

  {
    path: 'companies',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/companies/company-list/company-list.component'
          ).then(m => m.CompanyListComponent)
      },

      {
        path: 'new',
        loadComponent: () =>
          import(
            './features/companies/company-form/company-form.component'
          ).then(m => m.CompanyFormComponent)
      },

      {
        path: ':companyId/edit',
        loadComponent: () =>
          import(
            './features/companies/company-form/company-form.component'
          ).then(m => m.CompanyFormComponent)
      },

      {
        path: ':companyId/vacancies',
        loadComponent: () =>
          import(
            './features/companies/company-vacancies/company-vacancies.component'
          ).then(m => m.CompanyVacanciesComponent)
      },

      {
        path: ':companyId/vacancies/new',
        loadComponent: () =>
          import(
            './features/vacancies/vacancy-form/vacancy-form.component'
          ).then(m => m.VacancyFormComponent)
      },

      {
        path: ':companyId/vacancies/:vacancyId/edit',
        loadComponent: () =>
          import(
            './features/vacancies/vacancy-form/vacancy-form.component'
          ).then(m => m.VacancyFormComponent)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'companies'
  }
];
