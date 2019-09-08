import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employeeUrl = `${baseUrl}/employee`;
  constructor(private _httpClient: _HttpClient) {}
  // Get employees
  getEmployees(limit: string, offset: string): Observable<any> {
    console.info('getEmployees called');
    const options = {
      limit: limit,
      offset: offset,
    };
    return this._httpClient.get(`${this.employeeUrl}`, options);
  }
  // Create new employee
  createEmployee(payload): Observable<any> {
    return this._httpClient.post(`${this.employeeUrl}`, payload);
  }
  // Update existing employee
  updateEmployee(id, payload): Observable<any> {
    return this._httpClient.put(`${this.employeeUrl}/${id}`, payload);
  }
  // Show an employee
  showEmployee(id): Observable<any> {
    return this._httpClient.get(`${this.employeeUrl}/${id}`);
  }
  // Delete a attachment
  deleteItsAttachment(id, attachment_id): Observable<any> {
    return this._httpClient.delete(`${this.employeeUrl}/${id}/attachment/${attachment_id}`);
  }
  // Get all employees
  getAll(): Observable<any> {
    return this._httpClient.get(`${this.employeeUrl}/all`);
  }
}
