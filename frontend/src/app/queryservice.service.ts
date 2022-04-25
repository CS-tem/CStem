import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueryserviceService {
  
  constructor(private http: HttpClient) { }

  public getInstitutes() : Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/institutes/`)
  }

  public getInstitute(id: number) : Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/institutes/${id}`)
  }
}
