import { Component } from '@angular/core';
import { PaymentsService } from '../payments.service';

declare let Stripe: any;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {

  stripe = Stripe("pk_test_51R3da7RrzVD5RoMv0ErZWPNX92YlXjguv7guuuN6wCHtUkfM1Ne0aw6DQ8YyJ6uVXXJyuFPwqMupESTjyliRlZuP00GobyBPms")

  amount: number = 12;
  transactionId: string = "";

  constructor(private service: PaymentsService) { }

  prepay() {
    this.service.prepay().subscribe(
      token => {
        this.transactionId = token as string
        this.showForm()
      },
      error => {
        alert("Error")
      }
    )
  }

  private showForm() {
    let elements = this.stripe.elements()
    let style = {
      base: {
        color: "#32325d", fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased", fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif', color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
    let card = elements.create("card", { style: style })
    card.mount("#card-element")
    card.on("change", function (event: any) {
      document.querySelector("button")!.disabled = event.empty;
      document.querySelector("#card-error")!.textContent =
        event.error ? event.error.message : "";
    });
    let self = this
    let form = document.getElementById("payment-form");
    form!.addEventListener("submit", function (event) {
      event.preventDefault();
      self.payWithCard(card);
    });
    form!.style.display = "block"
  }

  payWithCard(card: any) {
    let self = this
    this.stripe.confirmCardPayment(this.transactionId, {
      payment_method: {
        card: card
      }
    }).then(function (response: any) {
      if (response.error) {
        alert(response.error.message);
      } else {
        if (response.paymentIntent.status === 'succeeded') {
          alert("Pago exitoso");

          self.service.addCredits(self.amount).subscribe({
            next: (response: any) => {
              alert(response); // Muestra "Créditos actualizados."
            },
            error: (response: any) => {
              alert("Error al actualizar créditos");
            }
          });

          self.service.confirm(self.amount, self.transactionId).subscribe({
            next: (response: any) => {
              alert(response)
            },
            error: (response: any) => {
              alert(response)
            }
          })
        }
      }
    });
  }
}
