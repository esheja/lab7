import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, map, of, Subscription, switchMap} from 'rxjs';
import {AuthorsService} from '../service/authors.service';
import {AuthorEntity, BookTitle} from '../model/author';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class AuthorComponent implements OnInit, OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authorsService: AuthorsService = inject(AuthorsService);
  private subscription?: Subscription;
  private bioSubscription?: Subscription;

  requestedId = '';
  loading = false;
  selectedAuthor: AuthorEntity | null = null;
  bio: string | null = null;
  errorMessage = '';

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(params => params['id'] as string),
      switchMap(id => {
        this.requestedId = id;
        this.loading = true;
        this.selectedAuthor = null;
        this.bio = null;
        this.errorMessage = '';
        return this.authorsService.getAuthor(id).pipe(
          catchError((err: HttpErrorResponse) => {
            this.errorMessage = this.describeError(err, id);
            return of(null);
          })
        );
      })
    ).subscribe(author => {
      this.loading = false;
      this.selectedAuthor = author;
      if (author) {
        this.loadBio(String(author.id));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.bioSubscription?.unsubscribe();
  }

  /** Id of a book, taken from the end of its HATEOAS self link. */
  bookId(book: BookTitle): string | null {
    const href = book._links?.self?.href;
    const match = href?.match(/\/books\/(\d+)\/?$/);
    return match ? match[1] : null;
  }

  private loadBio(id: string): void {
    this.bioSubscription?.unsubscribe();
    this.bioSubscription = this.authorsService.getAuthorBio(id).subscribe({
      next: bio => this.bio = bio?.biodata ? bio.biodata : null,
      error: () => this.bio = null
    });
  }

  private describeError(err: HttpErrorResponse, id: string): string {
    if (err.status === 404 || err.status === 400) {
      return `Sorry, no author was found with id ${id}.`;
    }
    if (err.status === 0) {
      return 'Unable to reach the server. Please check that the Books API is running and try again.';
    }
    return `Something went wrong while looking up author ${id} (error ${err.status}).`;
  }
}
