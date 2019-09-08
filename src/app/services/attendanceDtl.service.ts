import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AttendanceDtlService {
  attendanceDtlUrl = `${baseUrl}/attendanceDtl`;
  constructor(private _httpClient: _HttpClient) {}
  // Index attendanceDtl
  getAttendanceDtl(limit: string, offset: string): Observable<any> {
    console.info('getAttendanceDtl called');
    const options = {
      limit: limit,
      offset: offset,
    };
    return this._httpClient.get(`${this.attendanceDtlUrl}`, options);
  }
  // Create new attendanceDtl
  createAttendanceDtl(payload): Observable<any> {
    return this._httpClient.post(`${this.attendanceDtlUrl}`, payload);
  }
  // Update existing attendanceDtl
  updateAttendanceDtl(id, payload): Observable<any> {
    return this._httpClient.put(`${this.attendanceDtlUrl}/${id}`, payload);
  }
  // Show one attendanceDtl
  showAttendanceDtl(id): Observable<any> {
    return this._httpClient.get(`${this.attendanceDtlUrl}/${id}`);
  }

  // Get attendance details by month and memebers
  getByMonthAndMembers(month, members): Observable<any> {
    const options = {
      month: month,
      members: JSON.stringify(members),
    };
    return this._httpClient.get(`${this.attendanceDtlUrl}/getByMonthAndMembers`, options);
  }
}
