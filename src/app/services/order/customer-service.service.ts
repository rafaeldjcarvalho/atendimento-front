import { CustomerPage } from './../../interfaces/customer-page.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, first } from 'rxjs';
import { CustomerService } from '../../interfaces/orderService.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private readonly API = 'http://localhost:8080/api/customerService';

  constructor(private httpClient: HttpClient) { }

  listAll(page = 0, pageSize = 12) {
    return this.httpClient.get<CustomerPage>(this.API, { params: { page, pageSize } })
      .pipe(
        first(),
        //delay(5000)
      );
  }

  getById(id: string) {
    return this.httpClient.get<CustomerService>(`${this.API}/${id}`);
  }

  save(record: Partial<CustomerService>) {
    //console.log(record);
    if (record.id) {
      // console.log('update');
      return this.update(record);
    }
    // console.log('create');
    return this.create(record);
  }

  private create(record: Partial<CustomerService>) {
    return this.httpClient.post<CustomerService>(this.API, record).pipe(first());
  }

  private update(record: Partial<CustomerService>) {
    return this.httpClient.put<CustomerService>(`${this.API}/${record.id}`, record).pipe(first());
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }

  listByClass(classId: string, page = 0, pageSize = 12) {
    return this.httpClient.get<CustomerPage>(`${this.API}/class/${classId}`, { params: { page, pageSize } })
      .pipe(
        first(),
        delay(2000)
      );
  }

  listByOwner(userId: string, page = 0, pageSize = 12) {
    return this.httpClient.get<CustomerPage>(`${this.API}/owner/${userId}`, { params: { page, pageSize } })
      .pipe(
        first(),
        delay(2000)
      );
  }

  listByStudent(studentId: string, page = 0, pageSize = 12) {
    return this.httpClient.get<CustomerPage>(`${this.API}/student/${studentId}`, { params: { page, pageSize } })
      .pipe(
        first(),
        delay(2000)
      );
  }
}
