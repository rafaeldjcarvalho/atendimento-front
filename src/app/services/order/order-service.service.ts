import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderPage } from '../../interfaces/order-page.interface';
import { delay, first } from 'rxjs';
import { OrderService } from '../../interfaces/orderService.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  private readonly API = 'http://localhost:8080/api/orders';

  constructor(private httpClient: HttpClient) { }

  listAll(page = 0, pageSize = 12) {
    return this.httpClient.get<OrderPage>(this.API, { params: { page, pageSize } })
      .pipe(
        first(),
        //delay(5000)
      );
  }

  getById(id: string) {
    return this.httpClient.get<OrderService>(`${this.API}/${id}`);
  }

  save(record: Partial<OrderService>) {
    //console.log(record);
    if (record.id) {
      // console.log('update');
      return this.update(record);
    }
    // console.log('create');
    return this.create(record);
  }

  private create(record: Partial<OrderService>) {
    return this.httpClient.post<OrderService>(this.API, record).pipe(first());
  }

  private update(record: Partial<OrderService>) {
    return this.httpClient.put<OrderService>(`${this.API}/${record.id}`, record).pipe(first());
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }

  listByClass(classId: string, page = 0, pageSize = 12) {
    return this.httpClient.get<OrderPage>(`${this.API}/class/${classId}`, { params: { page, pageSize } })
      .pipe(
        first(),
        delay(2000)
      );
  }

  listByUser(userId: string, page = 0, pageSize = 12) {
    return this.httpClient.get<OrderPage>(`${this.API}/user/${userId}`, { params: { page, pageSize } })
      .pipe(
        first(),
        delay(2000)
      );
  }
}
