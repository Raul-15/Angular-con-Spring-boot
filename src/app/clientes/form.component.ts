import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
// Deprecated --------- import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public regiones: Region[];
  public titulo: string = 'Crear cliente';

  public errores: string[];
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarCliente();
    console.log(this.cargarCliente);

    this.clienteService
      .getRegiones()
      .subscribe((regiones) => (this.regiones = regiones));
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      (cliente) => {
        //Cambio
        this.router.navigate(['/clientes']);
        console.log(this.cliente);
        Swal.fire(
          'Nuevo Cliente',
          `Cliente ${cliente.nombre} creado con exito`,
          'success'
        ); //nueva sintaxis  Swal.fire
      },
      (err) => {
        //poblar los errores al atributo errores
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
        console.error('Codigo del error desde el backend: ' + err.status);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      (json) => {
        this.router.navigate(['/clientes']);
        console.log(this.cliente);
        Swal.fire(
          'Cliente actualizado',
          `${json.cliente.nombre}, ${json.mensaje}`,
          'success'
        );
      },
      (err) => {
        //poblar los errores al atributo errores
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
        console.error('Codigo del error desde el backend: ' + err.status);
      }
    );
  }
  // Comparar que el objeto 1 sea nullo o viceversa
  compararRegion(o1: Region, o2: Region): boolean {
    // Compara y lanza el ---- Seleccionar región ----
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    // Si ambos son nulos pues que sea false, de lo contrario comparar los id's
    // pedir que sea === null, es muy estricto pueden pedir un undefined tambien.
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined
      ? false
      : o1.id === o2.id;
  }
}
