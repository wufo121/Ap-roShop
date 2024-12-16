import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router, private appService: AppService) {}

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isButtonRed: boolean = false;

  onSubmit() {
    if (this.email && this.password) {
      this.appService.login(this.email, this.password).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);

          localStorage.setItem('currentUser', response);

          this.redirectToHomePage();
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Email ou password incorrect';
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
  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
