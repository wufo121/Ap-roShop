import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private router: Router, private appService: AppService) {}
  username: string = '';
  email: string = '';
  address: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  acceptTerms: boolean = false;
  errorMessage: string = '';
  isButtonRed: boolean = false;
  showTermsModal: boolean = false;

  onSubmit() {
    if (
      this.username &&
      this.email &&
      this.address &&
      this.password &&
      this.password === this.passwordConfirmation &&
      this.acceptTerms
    ) {
      this.appService
        .register(this.username, this.email, this.address, this.password)
        .subscribe({
          next: (response: any) => {
            console.log('Création de compte réussie', response);
            this.redirectToLogin();
          },
          error: (err) => {
            console.error("Échec de l'inscription", err);
            this.errorMessage =
              "Erreur lors de l'inscription. Veuillez réessayer.";
            this.isButtonRed = true;
            setTimeout(() => {
              this.isButtonRed = false;
            }, 300);
          },
        });
    } else {
      this.errorMessage =
        'Veuillez remplir tous les champs correctement et accepter les CGU';
      this.isButtonRed = true;
      setTimeout(() => {
        this.isButtonRed = false;
      }, 300);
    }
  }
  showTerms(event: Event) {
    event.preventDefault();
    this.showTermsModal = true;
  }

  hideTerms() {
    this.showTermsModal = false;
  }

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
