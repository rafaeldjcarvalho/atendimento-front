import { Access } from "../types/access.type";

export interface User {
  email: string,
  access: Access,
  status: string
}

export interface UserWithToken extends User {
  token: string
}
