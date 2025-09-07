import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class LoginComponent {
  loginData = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.loginData).subscribe({
      next: (user) => {
        console.log('Token from login:', user.token);
        localStorage.setItem('token', user.token);
        this.router.navigate(['/']); // أضف إعادة التوجيه
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('خطأ في تسجيل الدخول');
      },
    });
  }
}
