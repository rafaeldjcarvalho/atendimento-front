import { User } from "./user.interface";

export interface Class {
  id: string,
  name: string,
  date: string,
  owner?: User
}
