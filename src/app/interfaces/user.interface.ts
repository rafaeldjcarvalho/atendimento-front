import { Access } from "../types/access.type";
import { Status } from "../types/status.type";

export interface User {
  id: string,
  name: string
  email: string,
  access: Access,
  status: Status
}

export interface UserWithToken extends User {
  token: string
}
