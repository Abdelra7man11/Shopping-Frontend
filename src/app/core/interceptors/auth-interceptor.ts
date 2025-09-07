import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  // let token = authService.getToken();
  // const authReq = req.clone({
  //   setHeaders: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
  return next(req.clone());
};

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem('token');
//     console.log('Token in interceptor:', token);

//     if (token) {
//       const cloned = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return next.handle(cloned);
//     }

//     return next.handle(req);
//   }
// }
