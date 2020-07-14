// Esta clase debe inyectar en CLIENTES.COMPONENTS.TS(ABRIR) Y DETALLE.COMPONENTS.TS(CERRAR)
// Una vez inyectado(importado) se puede colocar en el constructor

import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modal: boolean = false;

  //En typescript poner guin abajo, significa que esta variable:_notificarUpload es Diferente al METODO.
  private _notificarUpload = new EventEmitter<any>();

  constructor() {}

// SE IMPLEMENTA EN DETALLE.COMPONENT.TS
  get notificarUpload(): EventEmitter<any>{
    return this._notificarUpload;

  }

  abrirModal() {
    this.modal = true;
  }

  cerrarModal() {
    this.modal = false;
  }
}
