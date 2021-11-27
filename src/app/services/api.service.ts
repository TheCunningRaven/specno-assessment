import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { IOffice } from '../interfaces/offices';
import { IEmployee } from '../interfaces/employees';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {

  }

  //Basic error handling
  private handleError(error: HttpErrorResponse, data) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    }
    else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  // API Methods

  // OFFICES
  getOffices() {
    return this.http.get<IOffice[]>(this.baseUrl + 'offices').pipe(
      catchError(this.handleError)
    );
  }
  deleteOffice(officeId:number) {
    return this.http.delete<any>(this.baseUrl + `offices/${officeId}`).pipe(
      catchError(this.handleError)
    );
    
  }
  addOffice(officeData: any) {
    return this.http.post<IOffice[]>(this.baseUrl +'offices', officeData).pipe(
      catchError(this.handleError)
    );
    
  }
  updateOffice(officeId :number, officeData: any) {
    return this.http.put<any>(this.baseUrl + `offices/${officeId}`, officeData).pipe(
      catchError(this.handleError)
    );
  }

  // EMPLOYEES

  getEmployeesByOfficeId(employeeId: number): Observable<IEmployee[]> {
    return this.http.get<any>(this.baseUrl + `employees?officeId=${employeeId}`).pipe(
      catchError(this.handleError)
    );
  }
  addEmployee(employeeData: any) {
    return this.http.post<IEmployee[]>(this.baseUrl + 'employees', employeeData).pipe(
      catchError(this.handleError)
    );
  }
  deleteEmployee(employeeId: number) {
    return this.http.delete<any>(this.baseUrl + `employees/${employeeId}`).pipe(
      catchError(this.handleError)
    );
  }
  updateEmployee(employeeId:number, employeeData: any) {
    return this.http.put<any>(this.baseUrl + `employees/${employeeId}`, employeeData).pipe(
      catchError(this.handleError)
    );
  }
}
