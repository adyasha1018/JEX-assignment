import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Vacancy } from '../models/vacancy.model';
import { VacancyService } from './vacancy.service';

describe('VacancyService', () => {
  let service: VacancyService;
  let http: HttpTestingController;

  const vacancy: Vacancy = {
    id: 'vacancy/1',
    title: 'Developer',
    description: 'Build things',
    companyId: 'company-1',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VacancyService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(VacancyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets vacancies and filters them by company', () => {
    service.getVacancies().subscribe((result) => expect(result).toEqual([vacancy]));
    let request = http.expectOne('http://localhost:3000/vacancies');
    expect(request.request.method).toBe('GET');
    request.flush([vacancy]);

    service.getVacanciesByCompany(vacancy.companyId).subscribe();
    request = http.expectOne(
      (request) =>
        request.url === 'http://localhost:3000/vacancies' &&
        request.params.get('companyId') === 'company-1',
    );
    expect(request.request.method).toBe('GET');
    request.flush([vacancy]);
  });

  it('encodes vacancy ids and sends CRUD requests', () => {
    service.getVacancy(vacancy.id).subscribe();
    let request = http.expectOne('http://localhost:3000/vacancies/vacancy%2F1');
    expect(request.request.method).toBe('GET');
    request.flush(vacancy);

    service
      .createVacancy({
        title: vacancy.title,
        description: vacancy.description,
        companyId: vacancy.companyId,
      })
      .subscribe();
    request = http.expectOne('http://localhost:3000/vacancies');
    expect(request.request.method).toBe('POST');
    request.flush(vacancy);

    service.updateVacancy(vacancy).subscribe();
    request = http.expectOne('http://localhost:3000/vacancies/vacancy%2F1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(vacancy);
    request.flush(vacancy);

    service.deleteVacancy(vacancy.id).subscribe();
    request = http.expectOne('http://localhost:3000/vacancies/vacancy%2F1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('passes HTTP errors to callers', () => {
    const errorHandler = vi.fn();
    service.getVacancy('missing').subscribe({ error: errorHandler });

    http
      .expectOne('http://localhost:3000/vacancies/missing')
      .flush('not found', { status: 404, statusText: 'Not Found' });

    expect(errorHandler).toHaveBeenCalled();
    expect(errorHandler.mock.calls[0][0].status).toBe(404);
  });
});
