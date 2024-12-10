import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AppService } from '../app.service';
import { error } from 'console';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private router: Router, private appService: AppService) {}

  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  errorMessage: string = '';
  isButtonRed: boolean = false;

  onSubmit() {
    if (
      this.email &&
      this.password &&
      this.password === this.passwordConfirmation
    ) {
      this.appService.register(this.email, this.password).subscribe({
        next: (response: any) => {
          console.log('Creation de compte reussi', response);
          this.redirectToHomePage();
        },
        error: (err) => {
          console.error('Register failed', err);
          this.errorMessage =
            "Erreur lors de l'inscription. Veuillez réessayer.";
          this.isButtonRed = true;
          setTimeout(() => {
            this.isButtonRed = false;
          }, 300);
        },
      });
    } else {
      this.errorMessage = 'Mot de passe ou identifiant incorrect';
      this.isButtonRed = true;
      setTimeout(() => {
        this.isButtonRed = false;
      }, 300);
    }
  }

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
