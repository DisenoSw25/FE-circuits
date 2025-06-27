import { Component, output } from '@angular/core';
import { Matrix } from './Matrix';
import { CircuitService } from '../circuit.service';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-circuit',
  standalone: false,
  templateUrl: './circuit.component.html',
  styleUrl: './circuit.component.css'
})
export class CircuitComponent {
  inputQubits : number
  outputQubits : number
  matrix? : Matrix
  generatedCode? : string;
  circuitId: string = '';
  circuitList: any;

  constructor(private service : CircuitService, private manager : ManagerService) {
    this.inputQubits = 3
    this.outputQubits = 3
  }

  buildMatrix() {
    this.matrix = new Matrix(this.inputQubits, this.outputQubits)
  }

  negate(row: number, col: number) {
    this.matrix!.values[row][col] = this.matrix?.values[row][col] == 0 ? 1 : 0
  }

  generateCode(){ // Implementar por nuestra cuenta
    // let token = sessionStorage.getItem("token")
    let token = this.manager.token

    this.service.generateCode(this.outputQubits, this.matrix!, token).subscribe(
      {
        next: (response: any) => {
          this.generatedCode = response.code;
        },
        error: (err) => {
          console.error(err);
        }
      }
      
      // ok => {
      //   console.log("Todo OK, José Luis")
      // },
      // error => {
      //   console.error("Algo ha ido mal")
      // }
    )
  }

  retrieveCircuit() {
    if (!this.circuitId.trim()) {
      alert('Por favor, ingrese un ID de circuito válido');
      return;
    }

    this.service.retrieveCircuit(this.circuitId).subscribe({
      next: (circuit: any) => {
        // Suponiendo que el circuito devuelto tiene propiedades como inputQubits, outputQubits y matrix
        this.inputQubits = circuit.inputQubits;
        this.outputQubits = circuit.outputQubits;
        
        // Recrear la matriz con los datos recuperados
        this.matrix = new Matrix(this.inputQubits, this.outputQubits);
        if (circuit.matrix && circuit.matrix.values) {
          this.matrix.values = circuit.matrix.values;
        }
        
        console.log('Circuito recuperado exitosamente');
      },
      error: (err) => {
        console.error('Error al recuperar el circuito:', err);
        alert('Error al recuperar el circuito. Verifique el ID e intente nuevamente.');
      }
    });
  }
}
