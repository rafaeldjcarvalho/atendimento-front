import { CustomerService, OrderService } from "./orderService.interface";

export interface OrderPage {
  orders: OrderService[];
  totalElements: number;
  totalPages: number;
}
