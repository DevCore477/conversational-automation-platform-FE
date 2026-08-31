import { type UserRole } from "@/common/enums/user.types";

import { type CompanyRole } from "./company.types";

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  token?: string;
}

export interface ResetPassword {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface InviteUser {
  email: string;
  role?: UserRole;
  expiresInHours?: number;
}

export interface InviteUserRegistration {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  companyId?: string;
  companyRole?: CompanyRole;
  companyStatus?: string
  createdAt?: string;
}

export interface WhatsAppConfig {
  configured: boolean;
  enabled: boolean;
  phoneNumberId?: string;
  businessPhoneNumber?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  whatsapp?: WhatsAppConfig;
}

export interface ResetPasswordResponse {
  success: boolean;
}

// export interface AuthError {
//     message: string
//     statusCode?: number
// }
