import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private client: HttpClient) {}

  prepay(){
    return this.client.get("https://localhost:8082/payments/prepay", {responseType: 'text' as 'json'}) // La url habría que ponerla en un fichero de config
  }
   
}
