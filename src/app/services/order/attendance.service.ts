import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private readonly API = 'http://localhost:8080/api/attendance';

  constructor(private httpClient: HttpClient) { }

  getAttendancesByService(serviceId: number): Observable<any> {
    return this.httpClient.get(`${this.API}/by-service/${serviceId}`);
  }

  registerAttendance(serviceId: string, userId: string, status: 'PRESENTE' | 'AUSENTE') {
    return this.httpClient.post(`${this.API}/${serviceId}/register?userId=${userId}&status=${status}`, null, { responseType: 'text' as 'json' });
  }

  updateAttendance(attendanceId: string, status: 'PRESENTE' | 'AUSENTE'): Observable<any> {
    return this.httpClient.put(`${this.API}/update/${attendanceId}`, null, {
      params: { status },
    });
  }
}
