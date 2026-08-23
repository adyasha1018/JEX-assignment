import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Company } from '../models/company.model';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let http: HttpTestingController;

  const company: Company = {
    id: '1',
    name: 'Acme',
    address: 'Main Street',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CompanyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets all companies', () => {
    service.getCompanies().subscribe((result) => expect(result).toEqual([company]));

    const request = http.expectOne('http://localhost:3000/companies');
    expect(request.request.method).toBe('GET');
    request.flush([company]);
  });

  it('creates, gets, updates, and deletes a company', () => {
    service.createCompany({ name: company.name, address: company.address }).subscribe();
    let request = http.expectOne('http://localhost:3000/companies');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: company.name, address: company.address });
    request.flush(company);

    service.getCompany(company.id).subscribe();
    request = http.expectOne('http://localhost:3000/companies/1');
    expect(request.request.method).toBe('GET');
    request.flush(company);

    service.updateCompany(company).subscribe();
    request = http.expectOne('http://localhost:3000/companies/1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(company);
    request.flush(company);

    service.deleteCompany(company.id).subscribe();
    request = http.expectOne('http://localhost:3000/companies/1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('passes HTTP errors to callers', () => {
    const errorHandler = vi.fn();
    service.getCompanies().subscribe({ error: errorHandler });

    http
      .expectOne('http://localhost:3000/companies')
      .flush('server error', { status: 500, statusText: 'Server Error' });

    expect(errorHandler).toHaveBeenCalled();
    expect(errorHandler.mock.calls[0][0].status).toBe(500);
  });
});
