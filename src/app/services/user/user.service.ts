import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { delay, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API = 'http://localhost:8080/api/user';

  constructor(private httpClient: HttpClient) { }

  loadById(id: string) {
    return this.httpClient.get<User>(`${this.API}/${id}`);
  }

  listByClassId(classId: string) {
    return this.httpClient.get<User[]>(`${this.API}/user-class/${classId}`)
      .pipe(
        first(),
        //delay(2000)
      );
  }

  teacherListByClassId(classId: string) {
    return this.httpClient.get<User[]>(`${this.API}/userTeachers-class/${classId}`)
      .pipe(
        first(),
        //delay(2000)
      );
  }

  monitorListByClassId(classId: string) {
    return this.httpClient.get<User[]>(`${this.API}/userMonitors-class/${classId}`)
      .pipe(
        first(),
        //delay(2000)
      );
  }
}
