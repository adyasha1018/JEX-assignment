import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CompanyService } from '../../../core/services/company.service';
import { CompanyFormComponent } from './company-form.component';

describe('CompanyFormComponent', () => {
  let fixture: ComponentFixture<CompanyFormComponent>;
  let component: CompanyFormComponent;
  let companyService: {
    getCompany: ReturnType<typeof vi.fn>;
    createCompany: ReturnType<typeof vi.fn>;
    updateCompany: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  function create(companyId: string | null = null): void {
    TestBed.configureTestingModule({
      imports: [CompanyFormComponent],
      providers: [
        { provide: CompanyService, useValue: companyService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap(companyId ? { companyId } : {})),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(CompanyFormComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    companyService = {
      getCompany: vi.fn(() => of({ id: 'c1', name: 'Acme', address: 'Main' })),
      createCompany: vi.fn(() => of({ id: 'c2', name: 'New', address: 'Road' })),
      updateCompany: vi.fn(() => of({ id: 'c1', name: 'Updated', address: 'Road' })),
    };
    router = { navigate: vi.fn() };
  });

  it('starts in create mode and rejects an invalid form', () => {
    create();

    expect(component.isEditMode).toBe(false);
    component.onSubmit();

    expect(component.companyForm.touched).toBe(true);
    expect(companyService.createCompany).not.toHaveBeenCalled();
  });

  it('creates a valid company and navigates back to the list', () => {
    create();
    component.companyForm.setValue({ name: 'New', address: 'Road' });

    component.onSubmit();

    expect(companyService.createCompany).toHaveBeenCalledWith({ name: 'New', address: 'Road' });
    expect(router.navigate).toHaveBeenCalledWith(['/companies']);
  });

  it('loads edit data and reports save errors', () => {
    companyService.updateCompany.mockReturnValue(throwError(() => new Error('offline')));
    create('c1');

    expect(component.isEditMode).toBe(true);
    expect(component.companyForm.getRawValue()).toEqual({ name: 'Acme', address: 'Main' });

    component.companyForm.setValue({ name: 'Updated', address: 'Road' });
    component.onSubmit();

    expect(companyService.updateCompany).toHaveBeenCalledWith({
      id: 'c1',
      name: 'Updated',
      address: 'Road',
    });
    expect(component.error()).toBe('Unable to update the company.');
    expect(component.saving()).toBe(false);
  });

  it('reports edit load errors', () => {
    companyService.getCompany.mockReturnValue(throwError(() => new Error('missing')));
    create('missing');

    expect(component.error()).toBe('Unable to load the company.');
    expect(component.loading()).toBe(false);
  });
});
