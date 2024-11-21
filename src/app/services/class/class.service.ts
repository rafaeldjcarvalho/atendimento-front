import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Class } from '../../interfaces/class.interface';
import { first } from 'rxjs';
import { ClassPage } from '../../interfaces/class-page.interface';

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
}