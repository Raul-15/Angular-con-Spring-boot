import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    Swal.fire(
      'Logout',
      `Hola ${this.authService.usuario.username}, has cerrado sesion con exito!`,
      'success'
    );
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
