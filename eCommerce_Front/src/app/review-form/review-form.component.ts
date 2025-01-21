import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AppService } from '../app.service';
@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss',
})
export class ReviewFormComponent {
  @Output() submitReview = new EventEmitter<Review>();
  @Output() closeModal = new EventEmitter<void>();
  @Input() articleId!: string;

  reviewForm: FormGroup;
  hoveredRating = 0;
  currentUser: any;

  constructor(private fb: FormBuilder, private appService: AppService) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
    });

    this.appService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit(): void {
    if (this.reviewForm.valid && this.currentUser) {
      const reviewData = {
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment,
      };

      this.appService.addReview(this.articleId, reviewData).subscribe({
        next: (response) => {
          if (response.sucess) {
            const newReview = response.data[response.data.length - 1];
            console.log('Nouvel avis:', newReview);
            this.submitReview.emit(newReview);

            this.reviewForm.reset();

            this.closeModal.emit();

            this.cancel();
          }
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout de l'avis:", error);
          this.cancel();
        },
      });
    } else if (!this.currentUser) {
      alert('Vous devez être connecté pour laisser un avis');
    }
  }

  cancel(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.closeModal.emit();
    }
  }
}
interface Review {
  rating: number;
  comment: string;
  date: Date;
  username: string;
}
