import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private client: HttpClient) { }

  prepay() {
    return this.client.get("http://localhost:8082/payments/prepay", { responseType: 'text' as 'json' }) // La url habría que ponerla en un fichero de config
  }

  confirm(amount: number, paymentIntentId: string) {
    return this.client.post("http://localhost:8082/payments/confirm", {
      amount: amount,
      paymentIntentId: paymentIntentId
    }, {
      withCredentials: true,
      observe: "response"
    });
  }

  addCredits(amount: number) {
    return this.client.post("http://localhost:8082/payments/addCredits", amount, {
      responseType: 'text'
    });
  }

}
