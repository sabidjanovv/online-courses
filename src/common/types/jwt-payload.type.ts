import { UserRole } from "../enums/enum";

export interface JwtPayload {
  id: string;
  isActive: boolean;
  role: UserRole;
  name: string;
  email: string;
  hashed_refresh_token?: string;
}
