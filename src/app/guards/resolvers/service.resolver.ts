import { Injectable } from "@angular/core";
import { CustomerServiceService } from "../../services/order/customer-service.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { first, map, Observable, of } from "rxjs";
import { CustomerService, OrderService } from "../../interfaces/orderService.interface";
import { OrderServiceService } from "../../services/order/order-service.service";


@Injectable({
  providedIn: 'root'
})
export class ServiceResolver  {

  classId!: string;

  constructor(private service: CustomerServiceService, private orderService: OrderServiceService, private auth: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CustomerService> {
    // editando atendimento...
    if (route.params && route.params['id']) {
      return this.service.getById(route.params['id']);
    }

    // criando atendimento a partir de um pedido de atendimento
    if (route.params && route.params['id_order']) {
      const user = this.auth.getLoggedInUserId();
      return this.orderService.getById(route.params['id_order']).pipe(
        first(),
        map((order) =>({
          id: '',
          title: order.title,
          description: order.description,
          date: order.date,
          time_start: order.time_start,
          time_end: order.time_end,
          status: order.status,
          classId: order.classId,
          userId: user? user : '',
          studentId: order.userId
        }))
      );
    }

    // criando um novo atendimento sem pedido
    if (route.params && route.params['idClass']) {
      this.classId = route.params['idClass'];
    }

    //return of({ id: '', title: '', description: '', date: '', time_start: '', time_end: '', status: "Pendente",
    //  classId: this.classId, ownerId: ''
    //});

    return this.auth.user$.pipe(
      first(), // Obtém o valor atual do usuário logado
      map((user) => ({
        id: '',
        title: '',
        description: '',
        date: '',
        time_start: '',
        time_end: '',
        status: "Pendente",
        classId: this.classId,
        userId: user?.id || '',
        studentId: ''
      }))
    );
  }
}


