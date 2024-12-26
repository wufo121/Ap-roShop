import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-article',
  standalone: true,
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class AddArticleComponent {
  article = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imagePath: '',
  };

  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private appService: AppService, private router: Router) {}

  previewImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm(): void {
    if (this.validateForm() && this.imageFile) {
      const formData = new FormData();
      formData.append('name', this.article.name);
      formData.append('description', this.article.description);
      formData.append('price', this.article.price.toString());
      formData.append('category', this.mapCategory(this.article.category));
      formData.append('stock', this.article.stock.toString());
      formData.append('image', this.imageFile);
      this.addArticleAsync(formData);
    } else {
      alert('Veuillez remplir tous les champs et sélectionner une image.');
    }
  }

  async addArticleAsync(formData: FormData): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.appService.addArticle(formData)
      );
      console.log('Article ajouté avec succès:', response);
      this.resetForm();
      this.redirectToHome();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article:", error);
    }
  }
  mapCategory(category: string): string {
    const categoryMap: { [key: string]: number } = {
      'non végétarien': 1,
      végétarien: 2,
      'boissons alcolisées': 3,
      'boissons non-alcolisées': 4,
    };

    return categoryMap[category].toString();
  }

  validateForm(): boolean {
    return (
      this.article.name.trim() !== '' &&
      this.article.description.trim() !== '' &&
      this.article.price > 0 &&
      this.article.category.trim() !== '' &&
      this.article.stock >= 0
    );
  }

  resetForm(): void {
    this.article = {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imagePath: '',
    };
    this.imageFile = null;
    this.imagePreview = null;
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }
}
