import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Class } from '../../interfaces/class.interface';
import { first, Observable } from 'rxjs';
import { ClassPage } from '../../interfaces/class-page.interface';
import { ReportData } from '../../interfaces/report/report.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private readonly API = 'http://localhost:8080/api/class';

  constructor(private httpClient: HttpClient) { }

  list(page = 0, pageSize = 10) {
    return this.httpClient.get<ClassPage>(this.API, { params: { page, pageSize } })
      .pipe(
        first(),
        //delay(5000),
        // tap(courses => console.log(courses))
      );
  }

  loadById(id: string) {
    return this.httpClient.get<Class>(`${this.API}/${id}`);
  }

  save(record: Partial<Class>) {
    //console.log(record);
    if (record.id) {
      // console.log('update');
      return this.update(record);
    }
    // console.log('create');
    return this.create(record);
  }

  private create(record: Partial<Class>) {
    return this.httpClient.post<Class>(this.API, record).pipe(first());
  }

  private update(record: Partial<Class>) {
    return this.httpClient.put<Class>(`${this.API}/${record.id}`, record).pipe(first());
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }

  subscribeUser(classId: string, userId: string) {
    return this.httpClient.post(`${this.API}/${classId}/add-user/${userId}`, null).pipe(first());
  }

  getClassesUser(userId: string) {
    return this.httpClient.get<Class[]>(`${this.API}/class-user/${userId}`);
  }

  cancelSubscribe(classId: string, userId: string) {
    return this.httpClient.delete(`${this.API}/${classId}/remove-user/${userId}`).pipe(first());
  }

  getCalendars(classId: string) {
    return this.httpClient.get<any[]>(`${this.API}/${classId}/calendars`);
  }

  getReport(classId: string) {
    return this.httpClient.get<ReportData>(`${this.API}/${classId}/report`);
  }

  generateReport(classId: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf' // Indicando que esperamos um PDF como resposta
    });
    return this.httpClient.get(`${this.API}/${classId}/report/pdf`, { headers, responseType: 'blob' });
  }

  getSchedules(calendarId: number) {
    return this.httpClient.get<any[]>(`http://localhost:8080/api/calendar/${calendarId}/schedules`);
  }

  addCalendar(classId: string, calendarDTO: any) {
    return this.httpClient.post(`${this.API}/${classId}/calendars`, calendarDTO).pipe(first());
  }

  removeCalendar(classId: string, calendarId: number) {
    return this.httpClient.delete(`${this.API}/${classId}/calendars/${calendarId}`).pipe(first());
  }

  promoteToMonitor(classId: string, userId: string) {
    return this.httpClient.put(`${this.API}/${classId}/promote/${userId}`, null).pipe(first());
  }

  demoteToStudent(classId: string, userId: string) {
    return this.httpClient.put(`${this.API}/${classId}/demote/${userId}`, null).pipe(first());
  }
}
