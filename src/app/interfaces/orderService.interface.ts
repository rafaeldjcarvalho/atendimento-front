import { ServiceStatus } from "../types/serviceStatus.type";

export interface OrderService {
  id: string,
  title: string,
  description: string,
  date: string,
  time_start: string,
  time_end: string,
  status: ServiceStatus,
  classId: string,
  ownerId: string
}
