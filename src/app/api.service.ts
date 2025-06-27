import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, credentials,{responseType: 'text'});
  }
  register(user: { name: string; surname: string; email: string; password: string }): Observable<any> {
  return this.http.post(`${this.baseUrl}/users/registro`,user,{responseType: 'text'});
}
}
