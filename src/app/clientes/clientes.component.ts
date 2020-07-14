import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  public urlBackend: string = URL_BACKEND;

  constructor(
    //Inyeccion de dependencias
    private clienteService: ClienteService,
    public activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    //No se crea un nuevo componnet mejor reutilizar el de clientes, para que se actualice sin eliminar otros complentos

    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page'); // El simbolo de '+' lo convierte en un integer

      if (!page) {
        page = 0;
      }

      this.clienteService
        .getClientes(page)
        .pipe(
          tap((response) => {
            // Tap no es void, no retorna nada.
            //this.clientes = clientes ----------- Puede estar aca en vez del subscribe y el subscribe() que es fundamental
            console.log('Cliente service: Tap 3');
            (response.content as Cliente[]).forEach((cliente) =>
              console.log(cliente.nombre)
            );
          })
        )
        .subscribe(
          // el Observable que se suscribe // subscribe es un metodo que nos permite susbcribirnos dentro del flujo y nos permite hacer algo.
          (response) => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
          }
        );
    });

    this.modalService.notificarUpload.subscribe((cliente) => {
      this.clientes = this.clientes.map((clienteOriginal) => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Are you sure?',
      text: ` ${cliente.nombre}, You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe((response) => {
          this.clientes = this.clientes.filter((cli) => cli !== cliente); // No muestra que quita de la lista a cliente eliminado
          Swal.fire(` ${cliente.nombre} was Deleted !`, 'success');
        });
      }
    });
  }
  //Aca va a tomar al cliente que hizo click 'cliente' y se lo asignara al clienteSeleccionado
  // Se llama el metodo del modalservice.ts

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    //console.log(this.modalService.abrirModal());
    this.modalService.abrirModal();
  }
}
