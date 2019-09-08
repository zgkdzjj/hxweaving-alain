import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groupUrl = `${baseUrl}/attendanceGrp`;
  constructor(private _httpClient: _HttpClient) {}
  // Get all attendance
  getGroups(limit: string, offset: string): Observable<any> {
    console.info('getGroup called');
    const options = {
      limit: limit,
      offset: offset,
    };
    return this._httpClient.get(`${this.groupUrl}`, options);
  }
  // Create new schedule
  createGroup(payload): Observable<any> {
    return this._httpClient.post(`${this.groupUrl}`, payload);
  }
  // Update existing department
  updateGroup(id, payload): Observable<any> {
    return this._httpClient.put(`${this.groupUrl}/${id}`, payload);
  }
  // Show one schedule
  showGroup(id): Observable<any> {
    return this._httpClient.get(`${this.groupUrl}/${id}`);
  }
  // // Add employees to department
  // addEmployee(id, payload): Observable<any> {
  //   return this._httpClient.post(`${this.departmentUrl}/${id}/addEmployee`, payload);
  // }
  // // Delete employees from department
  // deleteEmployee(id, list): Observable<any> {
  //   return this._httpClient.delete(`${this.departmentUrl}/${id}/deleteEmployee/${list}`);
  // }
}
