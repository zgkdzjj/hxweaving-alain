import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  scheduleUrl = `${baseUrl}/schedule`;
  constructor(private _httpClient: _HttpClient) {}
  // Get all attendance
  getSchedule(limit: string, offset: string): Observable<any> {
    console.info('getSchedule called');
    const options = {
      limit: limit,
      offset: offset,
    };
    return this._httpClient.get(`${this.scheduleUrl}`, options);
  }
  // Create new schedule
  createSchedule(payload): Observable<any> {
    return this._httpClient.post(`${this.scheduleUrl}`, payload);
  }
  // Update existing department
  updateSchedule(id, payload): Observable<any> {
    return this._httpClient.put(`${this.scheduleUrl}/${id}`, payload);
  }
  // Show one schedule
  showSchedule(id): Observable<any> {
    return this._httpClient.get(`${this.scheduleUrl}/${id}`);
  }
  // // Add employees to department
  // addEmployee(id, payload): Observable<any> {
  //   return this._httpClient.post(`${this.departmentUrl}/${id}/addEmployee`, payload);
  // }
  // // Delete employees from department
  // deleteEmployee(id, list): Observable<any> {
  //   return this._httpClient.delete(`${this.departmentUrl}/${id}/deleteEmployee/${list}`);
  // }
  // Get all schedule
  getAll(): Observable<any> {
    return this._httpClient.get(`${this.scheduleUrl}/all`);
  }

  // Sections Object to section description
  objToDescription(obj: any[]) {
    const desArray = [];
    if (Array.isArray(obj)) {
      obj.forEach(e => {
        desArray.push(`${e['start']['time']} - ${e['end']['across'] === 0 ? '' : '次日'}${e['end']['time']}`);
      });
    }
    return desArray.join(' ');
  }

  // Implicit Convert HH:MM to Date Object
  hhMmToDate(dateString) {
    if (dateString == null) {
      return null;
    }
    const timeArray = dateString.split(':');
    const dateObj = new Date();
    dateObj.setHours(timeArray[0]);
    dateObj.setMinutes(timeArray[1]);
    return dateObj;
  }
  // Implicit Convert HH:MM  +/- min to Date Object
  hhMmAddMinToDate(dateString, min: number) {
    if (dateString == null) {
      return null;
    }
    const timeArray = dateString.split(':');
    const dateObj = new Date();
    const totalMin = parseInt(timeArray[0], 10) * 60 + parseInt(timeArray[1], 10);
    console.info(totalMin);
    const updatedMin = totalMin + min;
    console.info(updatedMin);
    dateObj.setHours(Math.floor(updatedMin / 60));
    dateObj.setMinutes(updatedMin % 60);
    return dateObj;
  }
}
