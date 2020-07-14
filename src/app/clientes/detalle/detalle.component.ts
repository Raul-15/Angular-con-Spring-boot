import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/usuarios/auth.service';

import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
// este private solo se usuara en la clase y no en la clase component ya que el metodo esta llamandose desde el html
export class DetalleComponent implements OnInit {
  //Ya no iria el metodo en OnInit para el
  @Input() cliente: Cliente;

  public titulo: string = 'Detalle de imagen';
  fotoSeleccionado: File;
  progreso: number = 0;

  //Inyectando clienteservice ne el constructor.
  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    /*  this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = +params.get('id');

      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });*/
  }
  // Este metodo tiene un arreglo de archivo pero solo cogeremos el primero, o sea el primero.
  // CADA VEZ que se sube una foto se reinicia el progreso por ende progreso = 0
  seleccionarFoto(event) {
    this.fotoSeleccionado = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionado);
    if (this.fotoSeleccionado.type.indexOf('image') < 0) {
      Swal.fire(
        'Error debe seleccionar una imagen',
        'Debe ser de tipo imagen',
        'error'
      );
      this.fotoSeleccionado = null;
    }
  }
  // este metodo debe tener dos parametros el nombre del archivo y su ID
  // este (this.cliente = cliente;) ya viene con la foto incluida.
  // ahora se subscribe 'event'
  // UploadProgress
  //Luego se calcula el porcentaje del progreso. semultiplica por 100, tiene su formula
  subirFoto() {
    if (!this.fotoSeleccionado) {
      Swal.fire(
        'Error: Debe selccionar una foto',
        'Debe seleccionar una foto',
        'error'
      );
    } else {
      this.clienteService
        .subirFoto(this.fotoSeleccionado, this.cliente.id)
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            //Emitira la foto del cliente actualizada // lleva nuevo objeto this.cliente
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire(
              'La foto se ha subido con exito!  ;)',
              response.mensaje,
              'success'
            );
          }
        });
    }
  }
  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionado = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void {
    Swal.fire({
      title: 'Are you sure?',
      text: ` ¿Seguro que desea eliminar la factura: ?${factura.description} `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this.facturaService.delete(factura.id).subscribe((response) => {
          this.cliente.facturas = this.cliente.facturas.filter(
            (fa) => fa !== factura
          ); // No muestra que quita de la lista a cliente eliminado
          Swal.fire(
            ` Factura: ${factura.description} Eliminada con éxito!`,
            'success'
          );
        });
      }
    });
  }
}
