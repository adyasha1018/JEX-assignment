import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Company } from '../../../core/models/company.model';
import { Vacancy } from '../../../core/models/vacancy.model';
import { CompanyService } from '../../../core/services/company.service';
import { VacancyService } from '../../../core/services/vacancy.service';
import { CompanyListComponent } from './company-list.component';

describe('CompanyListComponent', () => {
  let fixture: ComponentFixture<CompanyListComponent>;
  let component: CompanyListComponent;
  let companyService: {
    getCompanies: ReturnType<typeof vi.fn>;
    deleteCompany: ReturnType<typeof vi.fn>;
  };
  let vacancyService: { getVacancies: ReturnType<typeof vi.fn> };

  const companies: Company[] = [
    { id: '1', name: 'Acme', address: 'Main Street' },
    { id: '2', name: 'Unused', address: 'Other Street' },
  ];
  const vacancies: Vacancy[] = [
    { id: 'v1', title: 'Developer', description: 'Build', companyId: '1' },
    { id: 'v2', title: 'Designer', description: 'Design', companyId: '1' },
  ];

  beforeEach(() => {
    companyService = {
      getCompanies: vi.fn(() => of(companies)),
      deleteCompany: vi.fn(() => of(void 0)),
    };
    vacancyService = { getVacancies: vi.fn(() => of(vacancies)) };
    TestBed.configureTestingModule({
      imports: [CompanyListComponent],
      providers: [
        provideRouter([]),
        { provide: CompanyService, useValue: companyService },
        { provide: VacancyService, useValue: vacancyService },
      ],
    });
  });

  function create(): void {
    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
  }

  it('loads companies and keeps only companies with vacancies', () => {
    create();

    expect(component.loading()).toBe(false);
    expect(component.companiesWithVacancies()).toEqual([companies[0]]);
    expect(component.getVacancyCount('1')).toBe(2);
    expect(component.getVacancyCount('2')).toBe(0);

    component.onSearch({ target: { value: 'main' } } as unknown as Event);
    expect(component.filteredCompanies()).toEqual([companies[0]]);
  });

  it('reports a load error', () => {
    companyService.getCompanies.mockReturnValue(throwError(() => new Error('offline')));
    create();

    expect(component.error()).toBe('Unable to load companies.');
    expect(component.loading()).toBe(false);
  });

  it('blocks deletion when the company has vacancies and deletes after confirmation', () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    create();

    component.deleteCompany(companies[0]);
    expect(alert).toHaveBeenCalled();
    expect(companyService.deleteCompany).not.toHaveBeenCalled();

    component.deleteCompany(companies[1]);
    expect(companyService.deleteCompany).toHaveBeenCalledWith('2');
    expect(component.companies()).toEqual([companies[0]]);

    confirm.mockRestore();
    alert.mockRestore();
  });
});
