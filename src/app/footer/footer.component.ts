import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public autor: any = {nombre: 'Andres', apellido: 'Guzman'};

  constructor() { }

  ngOnInit(): void {
  }

}

/*Any es para objetos genericos que no son de un tipo en particular*/
