import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private client : HttpClient) { }
  
  login(name: string, pwd: string) {
    let body = {
      name : name,
      pwd : pwd
    }
    return this.client.post<string>("http://localhost:8081/users/loginConBody", body, {responseType: 'text' as 'json'})
  }

  changePassword(email: string, newPassword: string) {
    let body = {
      email: email,
      newPassword: newPassword
    }
    return this.client.post<string>("http://localhost:8081/users/changePassword", body, {responseType: 'text' as 'json'})
  }
}
