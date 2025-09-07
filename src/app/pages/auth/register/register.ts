import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [FormsModule, CommonModule, RouterLink],
})
export class RegisterComponent {
  registerData = {
    displayName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService, private router: Router) {}
  validationErrors: string[] = [];

  register() {
    this.validationErrors = []; // امسح الأخطاء القديمة
    this.authService.register(this.registerData).subscribe({
      next: () => {
        alert('تم إنشاء الحساب بنجاح');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // عرض الأخطاء القادمة من Backend
        if (err.error?.errors) {
          this.validationErrors = err.error.errors;
        } else {
          this.validationErrors.push('حدث خطأ أثناء التسجيل');
        }
      },
    });
  }
}
