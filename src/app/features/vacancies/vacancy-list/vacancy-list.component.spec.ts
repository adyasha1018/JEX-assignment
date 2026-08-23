import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../../core/services/company.service';
import { VacancyService } from '../../../core/services/vacancy.service';
import { VacancyListComponent } from './vacancy-list.component';

describe('VacancyListComponent', () => {
  let fixture: ComponentFixture<VacancyListComponent>;
  let component: VacancyListComponent;
  let vacancyService: {
    getVacancies: ReturnType<typeof vi.fn>;
    deleteVacancy: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vacancyService = {
      getVacancies: vi.fn(() =>
        of([{ id: 'v1', title: 'Developer', description: 'Build', companyId: 'c1' }]),
      ),
      deleteVacancy: vi.fn(() => of(void 0)),
    };

    TestBed.configureTestingModule({
      imports: [VacancyListComponent],
      providers: [
        provideRouter([]),
        {
          provide: CompanyService,
          useValue: {
            getCompanies: vi.fn(() => of([{ id: 'c1', name: 'Acme', address: 'Main' }])),
          },
        },
        { provide: VacancyService, useValue: vacancyService },
      ],
    });
    fixture = TestBed.createComponent(VacancyListComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('loads vacancies and resolves company names', () => {
    expect(component.loading()).toBe(false);
    expect(component.getCompanyName('c1')).toBe('Acme');
    expect(component.getCompanyName('missing')).toBe('Unknown company');
  });

  it('shows an error when vacancies cannot be loaded', () => {
    vacancyService.getVacancies.mockReturnValue(throwError(() => new Error('offline')));
    component.ngOnInit();

    expect(component.error()).toBe('Unable to load vacancies.');
    expect(component.loading()).toBe(false);
  });

  it('removes a vacancy after confirmed deletion', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const vacancy = component.vacancies()[0];

    component.deleteVacancy(vacancy);

    expect(vacancyService.deleteVacancy).toHaveBeenCalledWith('v1');
    expect(component.vacancies()).toEqual([]);
    confirm.mockRestore();
  });
});
