import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthorEntity, BioEntity} from '../model/author';

const Url = 'http://localhost:8080/books-api/';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  private http: HttpClient = inject(HttpClient);

  public getAuthor(id: string): Observable<AuthorEntity> {
    return this.http.get<AuthorEntity>(Url + 'authors/' + id);
  }

  public getAuthorBio(id: string): Observable<BioEntity> {
    return this.http.get<BioEntity>(Url + 'authors/' + id + '/bio');
  }
}
