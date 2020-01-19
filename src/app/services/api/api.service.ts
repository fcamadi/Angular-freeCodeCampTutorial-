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
  
  handleError(httpError: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (httpError.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${httpError.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${httpError.status}\nMessage: ${httpError.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }


  /* with error handling - no pagination   
  public sendGetRequest(){
    return this.httpClient.get(this.SERVER_URL).pipe(catchError(this.handleError));
  }
  */

  parseLinkHeader(header) {
    if (header.length == 0) {
      return ;
    }

    let parts = header.split(',');
    var links = {};
    parts.forEach( p => {
      let section = p.split(';');
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;

    });

    this.first  = links["first"];
    this.last   = links["last"];
    this.prev   = links["prev"];
    this.next   = links["next"]; 
  }


  public sendGetRequest(){
    // Add safe, URL encoded _page and _limit parameters 

    return this.httpClient.get( this.SERVER_URL, 
      {  params: new HttpParams({fromString: "_page=1&_limit=20"}), observe: "response"}).pipe(retry(3), catchError(this.handleError), tap( res => {
      console.log(res.headers.get('Link'));
      this.parseLinkHeader(res.headers.get('Link'));
    }));
  }

  public sendGetRequestToUrl(url: string){  
    return this.httpClient.get(url, { observe: "response"}).pipe(retry(3), 			
    catchError(this.handleError), tap(res => {  
      console.log(res.headers.get('Link'));  
      this.parseLinkHeader(res.headers.get('Link'));
    }));  
  }
  
  
}
