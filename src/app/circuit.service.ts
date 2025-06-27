import { Injectable } from '@angular/core';
import { Matrix } from './circuit/Matrix';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  

  constructor(private http : HttpClient) { }

  generateCode(outputQubits: number, matrix: Matrix, token?: string) {
    let body = {
      outputQubits : outputQubits,
      table : matrix!.values
    }

    let header = token ? {
      "token_generacion" : token
    } : undefined
    return this.http.post("http://localhost:8080/circuits/generateCode", body, {headers: header})
  }

  getUserCircuits(token?: string): Observable<any> {
    let header = token ? {
      "token_generacion" : token
    } : undefined
    return this.http.get("http://localhost:8080/circuits/getCircuitList", { headers: header });
  }

  retrieveCircuit(id: string): Observable<any> {
    return this.http.get(`http://localhost:8080/circuits/retrieveCircuit/${id}`);
  }
}