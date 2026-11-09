import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthorsComponent } from './authors.component';

describe('AuthorsComponent', () => {
  let component: AuthorsComponent;
  let fixture: ComponentFixture<AuthorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorsComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(AuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not navigate for a non-numeric id', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.searchForm.setValue({authorId: 'abc'});
    component.onSubmit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the author id', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.searchForm.setValue({authorId: ' 4 '});
    component.onSubmit();
    expect((router.navigate as jasmine.Spy).calls.mostRecent().args[0]).toEqual(['./', '4']);
  });
});
