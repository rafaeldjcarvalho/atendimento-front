import { CustomerService } from "./orderService.interface";


export interface CustomerPage {
  services: CustomerService[];
  totalElements: number;
  totalPages: number;
}
