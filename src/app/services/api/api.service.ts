import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import {  throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';





@Injectable({
  providedIn: 'root'
})

export class ApiService {

  public first: string = "";  
  public prev: string = "";  
  public next: string = "";  
  public last: string = "";

  private SERVER_URL = "http://localhost:3000/products";

  constructor(private httpClient: HttpClient) { }


  /* without error handling
  public get(){  
		return this.httpClient.get(this.SERVER_URL);  
  } 
  */
  
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


  /* with error handling - no pagination   */
  public sendGetRequest(){
    return this.httpClient.get(this.SERVER_URL).pipe(catchError(this.handleError));
  }


  
}
