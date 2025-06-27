import { input } from "@angular/core"

export class Matrix {

    values : number[][]

    constructor(inputQubits: number, outputQubits: number) {
      this.values = []

      let rows = Math.pow(2, inputQubits)

      for (let i=0; i<rows; i++)
        this.addRow(i, inputQubits, outputQubits)
    }

    private addRow(index: number, inputQubits: number, outputQubits: number) {
        let row : number[] = []
        // 0 0 0   0 0
        // 0 0 1   0 0

        for (let i=0; i<inputQubits+outputQubits; i++){
            row.push(0)
        }

        let binary = index.toString(2).padStart(inputQubits, '0')
        for (let i=0; i<inputQubits; i++)
            row[i] = parseInt(binary.charAt(i))

        this.values.push(row)
    }
  }