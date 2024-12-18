import { ServiceStatus } from './../../types/serviceStatus.type';
import { Injectable } from "@angular/core";
import { OrderServiceService } from "../../services/order/order-service.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { first, map, Observable, of } from "rxjs";
import { OrderService } from "../../interfaces/orderService.interface";
import { AuthService } from '../../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class OrderResolver  {

  classId!: string;

  constructor(private service: OrderServiceService, private auth: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderService> {
    if (route.params && route.params['id']) {
      return this.service.getById(route.params['id']);
    }

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
        userId: user?.id || ''
      }))
    );
  }
}
