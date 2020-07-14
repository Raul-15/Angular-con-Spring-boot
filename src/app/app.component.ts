import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Bienvenido a Angular';

  curso: string = 'Curso Spring 5 con Angular 7';
  profesor: string = 'Andres Guzman';
}
