import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet]
})
export class AuthorsComponent {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private builder: FormBuilder = inject(FormBuilder);

  searchForm = this.builder.group({
    authorId: ['', [Validators.required, Validators.pattern('^\\s*\\d+\\s*$')]]
  });

  get authorId() {
    return this.searchForm.controls.authorId;
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const id = (this.authorId.value ?? '').trim();
    this.router.navigate(['./', id], {relativeTo: this.route}).then(() => {});
  }
}
