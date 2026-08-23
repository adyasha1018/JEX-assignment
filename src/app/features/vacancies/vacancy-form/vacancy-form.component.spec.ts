import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../../core/services/company.service';
import { VacancyService } from '../../../core/services/vacancy.service';
import { VacancyFormComponent } from './vacancy-form.component';

describe('VacancyFormComponent', () => {
  let fixture: ComponentFixture<VacancyFormComponent>;
  let component: VacancyFormComponent;
  let vacancyService: {
    getVacancy: ReturnType<typeof vi.fn>;
    createVacancy: ReturnType<typeof vi.fn>;
    updateVacancy: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  function create(vacancyId: string | null = null, companyId: string | null = 'c1'): void {
    TestBed.configureTestingModule({
      imports: [VacancyFormComponent],
      providers: [
        { provide: VacancyService, useValue: vacancyService },
        {
          provide: CompanyService,
          useValue: {
            getCompany: vi.fn(() => of({ id: 'c1', name: 'Acme', address: 'Main' })),
            getCompanies: vi.fn(() =>
              of([
                { id: 'c1', name: 'Acme', address: 'Main' },
                { id: 'c2', name: 'Globex', address: 'Broadway' },
              ]),
            ),
          },
        },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ companyId, ...(vacancyId ? { vacancyId } : {}) })),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(VacancyFormComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    vacancyService = {
      getVacancy: vi.fn(() =>
        of({ id: 'v1', title: 'Developer', description: 'Build', companyId: 'c1' }),
      ),
      createVacancy: vi.fn(() =>
        of({ id: 'v2', title: 'Designer', description: 'Design', companyId: 'c1' }),
      ),
      updateVacancy: vi.fn(() =>
        of({ id: 'v1', title: 'Updated', description: 'Build', companyId: 'c1' }),
      ),
    };
    router = { navigate: vi.fn() };
  });

  it('rejects an invalid create form without calling the API', () => {
    create();

    component.submit();

    expect(component.vacancyForm.touched).toBe(true);
    expect(vacancyService.createVacancy).not.toHaveBeenCalled();
  });

  it('creates a vacancy with the route company id', () => {
    create();
    component.vacancyForm.setValue({ title: 'Designer', description: 'Design' });

    component.submit();

    expect(vacancyService.createVacancy).toHaveBeenCalledWith({
      title: 'Designer',
      description: 'Design',
      companyId: 'c1',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/companies', 'c1', 'vacancies']);
  });

  it('creates an unscoped vacancy with the selected company id', () => {
    create(null, null);
    component.onCompanySelected('c2');
    component.vacancyForm.setValue({ title: 'Designer', description: 'Design' });

    component.submit();

    expect(vacancyService.createVacancy).toHaveBeenCalledWith({
      title: 'Designer',
      description: 'Design',
      companyId: 'c2',
    });
  });

  it('loads edit data and reports update errors', () => {
    vacancyService.updateVacancy.mockReturnValue(throwError(() => new Error('offline')));
    create('v1');

    expect(component.isEditMode).toBe(true);
    expect(component.vacancyForm.getRawValue()).toEqual({
      title: 'Developer',
      description: 'Build',
    });

    component.vacancyForm.setValue({ title: 'Updated', description: 'Build' });
    component.submit();

    expect(vacancyService.updateVacancy).toHaveBeenCalledWith({
      id: 'v1',
      title: 'Updated',
      description: 'Build',
      companyId: 'c1',
    });
    expect(component.error()).toBe('Unable to update vacancy.');
    expect(component.saving()).toBe(false);
  });

  it('reports a missing company id and does not save', () => {
    create(null, null);
    component.vacancyForm.setValue({ title: 'Designer', description: 'Design' });

    component.submit();

    expect(component.error()).toBe('Company could not be identified.');
    expect(vacancyService.createVacancy).not.toHaveBeenCalled();
  });
});
