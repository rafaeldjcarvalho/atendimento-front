import { Schedule } from "./schedule.interface";

export interface Calendar {
  id: string,
  ownerName: string,
  ownerId: string,
  schedules: Schedule[]
}
