import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css'],
})
export class DirectivaComponent implements OnInit {
  listaCurso: string[] = ['Typescript', ' Javascript', 'C#', 'Java SE', 'PHP'];

  habilitar:boolean = true;
  constructor() {}

  setHabilitar(): void{// Es un metodo que no retorna nada, asigna un valor al habilitar por eso es un void
    this.habilitar = (this.habilitar==true)? false: true; // sin this sale error
  }


  ngOnInit(): void {}
}
