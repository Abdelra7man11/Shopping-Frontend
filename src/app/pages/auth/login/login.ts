import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);

  loginData = {
    email: '',
    password: '',
  };

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      return;
    }
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        console.log('✅ Logged in user:', user);
        this.location.back();
      },
      error: (err) => {
        console.error('❌ Login failed', err);
      },
    });
  }
}
