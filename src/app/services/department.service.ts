import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  departmentUrl = `${baseUrl}/department`;
  constructor(private _httpClient: _HttpClient) {}
  // Get departments
  getDepartments(limit: string, offset: string): Observable<any> {
    console.info('getDepartment called');
    const options = {
      limit: limit,
      offset: offset,
    };
    return this._httpClient.get(`${this.departmentUrl}`, options);
  }
  // Create new department
  createDepartment(payload): Observable<any> {
    return this._httpClient.post(`${this.departmentUrl}`, payload);
  }
  // Update existing department
  updateDepartment(id, payload): Observable<any> {
    return this._httpClient.put(`${this.departmentUrl}/${id}`, payload);
  }
  // Show a department
  showDepartment(id): Observable<any> {
    return this._httpClient.get(`${this.departmentUrl}/${id}`);
  }
  // Add employees to department
  addEmployee(id, payload): Observable<any> {
    return this._httpClient.post(`${this.departmentUrl}/${id}/addEmployee`, payload);
  }
  // Delete employees from department
  deleteEmployee(id, list): Observable<any> {
    return this._httpClient.delete(`${this.departmentUrl}/${id}/deleteEmployee/${list}`);
  }

  // Get a list of all department
  getAll(): Observable<any> {
    return this._httpClient.get(`${this.departmentUrl}/all`);
  }
}
