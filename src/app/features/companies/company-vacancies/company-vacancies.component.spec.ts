import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../../core/services/company.service';
import { VacancyService } from '../../../core/services/vacancy.service';
import { CompanyVacanciesComponent } from './company-vacancies.component';

describe('CompanyVacanciesComponent', () => {
  let fixture: ComponentFixture<CompanyVacanciesComponent>;
  let component: CompanyVacanciesComponent;
  let vacancyService: {
    getVacanciesByCompany: ReturnType<typeof vi.fn>;
    deleteVacancy: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vacancyService = {
      getVacanciesByCompany: vi.fn(() =>
        of([{ id: 'v1', title: 'Developer', description: 'Build', companyId: 'c1' }]),
      ),
      deleteVacancy: vi.fn(() => of(void 0)),
    };
    TestBed.configureTestingModule({
      imports: [CompanyVacanciesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ companyId: 'c1' })) },
        },
        {
          provide: CompanyService,
          useValue: { getCompany: vi.fn(() => of({ id: 'c1', name: 'Acme', address: 'Main' })) },
        },
        { provide: VacancyService, useValue: vacancyService },
      ],
    });
    fixture = TestBed.createComponent(CompanyVacanciesComponent);
    component = fixture.componentInstance;
  });

  it('loads the company and its vacancies', () => {
    expect(component.company()?.name).toBe('Acme');
    expect(component.vacancies()).toHaveLength(1);
    expect(component.loading()).toBe(false);
  });

  it('reports vacancy load errors', () => {
    vacancyService.getVacanciesByCompany.mockReturnValue(throwError(() => new Error('offline')));
    fixture = TestBed.createComponent(CompanyVacanciesComponent);
    component = fixture.componentInstance;

    expect(component.error()).toBe('Unable to load vacancies.');
    expect(component.loading()).toBe(false);
  });

  it('deletes a confirmed vacancy', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteVacancy(component.vacancies()[0]);

    expect(vacancyService.deleteVacancy).toHaveBeenCalledWith('v1');
    expect(component.vacancies()).toEqual([]);
    confirm.mockRestore();
  });
});
