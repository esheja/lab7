import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthorComponent } from './author.component';

const Url = 'http://localhost:8080/books-api/authors/';

describe('AuthorComponent', () => {
  let fixture: ComponentFixture<AuthorComponent>;
  let component: AuthorComponent;
  let http: HttpTestingController;
  const params = new BehaviorSubject<{ id: string }>({id: '4'});

  beforeEach(async () => {
    params.next({id: '4'});
    await TestBed.configureTestingModule({
      imports: [AuthorComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: ActivatedRoute, useValue: {params: params.asObservable()}}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AuthorComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('should display the author when found', () => {
    http.expectOne(Url + '4').flush({
      id: 4, firstName: 'Koredo', lastName: 'Tablanga',
      books: [{title: 'SpringBoot JPA and REST',
        _links: {self: {href: 'http://localhost:8080/books-api/books/1'}}}]
    });
    http.expectOne(Url + '4/bio').flush({id: 5, biodata: 'Writes about Spring.'});
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Koredo');
    expect(text).toContain('Tablanga');
    expect(text).toContain('Writes about Spring.');
    expect(component.bookId(component.selectedAuthor!.books![0])).toBe('1');
  });

  it('should display a message when the author is not found', () => {
    http.expectOne(Url + '4').flush(null, {status: 404, statusText: 'Not Found'});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('no author was found with id 4');
  });

  it('should display a message when the server is unreachable', () => {
    http.expectOne(Url + '4').error(new ProgressEvent('error'), {status: 0});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Unable to reach the server');
  });
});
