import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common'; //Datepide para las vistas o tambien programatica
import locales from '@angular/common/locales/es';
import { Cliente } from './cliente';
import { Observable } from 'rxjs'; // Arreglo cliente se convierta en tipo string con el api observable
import { of, throwError } from 'rxjs'; // es un operador del api rxjs   (Observable, of)
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http'; // Debe inyectarse via contructor
import { map, catchError, tap } from 'rxjs/operators'; // Para conectar la API(SEGUNDA FORMA).
//Catcherror  maneja el flujo del Observable y si falla obtenemos el objeto del error.
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Region } from './region';

import { URL_BACKEND } from '../config/config';

@Injectable({
  // es solo para servicios y se puede inyectar a otros componentes.
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND + '/api/clientes';

  // private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' }); // Se importa

  constructor(
    private http: HttpClient,
    private router: Router
  ) /*Queda el http como variable de la clase*/ {}

  /*
  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer' + token);
    }
    return this.httpHeaders;
  }
  */

  // Se agregan las cabecers para autenticar el ingreso a cada uno de los links protegidos
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(
      this.urlEndPoint +
        '/regiones' /*{
        headers: this.agregarAuthorizationHeader()
      }*/
    );
    /*
      .pipe(
        catchError((e) => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );*/
  }

  getClientes(page: number): Observable<any> {
    // return of (CLIENTES); // Con esto convertirmos nuestro observable en un string
    //return this.http.get<Cliente[]>(this.urlEndPoint); //Debe ser del tipo cliente un Observable any, por ende se casteara con Cliente
    return this.http.get(this.urlEndPoint + '/pages/' + page).pipe(
      tap((response: any) => {
        // tomar algo. // no no modifica los valores // si estuviese abajo del map, el map cambiaria su valor

        console.log('Cliente service: Tap 1');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          // El operador map debe retornar el objeto modificado
          cliente.nombre = cliente.nombre.toUpperCase();

          let datepipe = new DatePipe('es'); //forma 01
          cliente.createAt = datepipe.transform(
            cliente.createAt,
            'EEEE dd, MMM yyyy'
          );
          //forma 02 //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US')// se usa formatdate exclusivo de angular // El formato original, y luego el formato
          return cliente;
        });
        return response;
      }),
      tap((response) => {
        // tomar algo. // no no modifica los valores // si estuviese abajo del map, el map cambiaria su valor
        console.log('Cliente service: Tap 2');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    //Cambio
    return this.http
      .post(
        this.urlEndPoint,
        cliente /*{
        headers: this.agregarAuthorizationHeader(),
      }*/
      )
      .pipe(
        //Cambio
        map((response: any) => response.cliente as Cliente), //Cambio
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http
      .get<Cliente>(
        `${this.urlEndPoint}/${id}` /*{
        headers: this.agregarAuthorizationHeader(),
      }*/
      )
      .pipe(
        // Siempre se dbe interpolar
        catchError((e) => {
          if (e.status != 401 && e.error.mensaje) {
            this.router.navigate(['/clientes']);
            console.error(e.error.mensaje);
          }

          return throwError(e);
        })
      );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(
        `${this.urlEndPoint}/${cliente.id}`,
        cliente /*{
        headers: this.agregarAuthorizationHeader(),
      }*/
      )
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }

          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(
        `${this.urlEndPoint}/${id}` /*{
        headers: this.agregarAuthorizationHeader(),
      }*/
      )
      .pipe(
        catchError((e) => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
  // formData es una clase de javascript
  //Al poner el Observable, se debe converir el return con pipe
  //En el map se convierte el cliente en un observable
  //El de la const res, reeplaza al 'http.post' por 'reqs'
  // en la const req: file es formData
  // Se retirara el pipe ya que no va a lanzar un Observable si no un objeto HttpEvent

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    /*
    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer' + token);
    }
    */
    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/upload`,
      formData,
      {
        reportProgress: true /* ,
        headers: httpHeaders,*/,
      }
    );

    return this.http.request(
      req
    ); /*.pipe(
      catchError((e) => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );*/
  }
}
