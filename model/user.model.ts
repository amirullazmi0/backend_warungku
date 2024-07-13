import { z } from 'zod';

export class userCreateRequest {
  email: string;
  fullName: string;
  password: string;
  address?: string;
  // images?: string;
  //   rolesName?: string;
  //   accessToken?: string;
  //   refreshToken: string;
}

export class userUpdateRequest {
  email?: string;
  fullName?: string;
  address?: string;
  // images?: string;
  //   rolesName?: string;
  //   accessToken?: string;
  //   refreshToken: string;
}
export class userCRUDResponse {
  email: string;
  fullName: string;
  accessToken?: string;
  refreshToken?: string;
}

export const userCreateSchema = z.object({
  email: z.string().min(1, 'email is required').email('Invalid email address'),
  fullName: z.string().min(1, 'full name is required').max(200, 'full name is too long'),
  password: z.string().min(1, 'password is required'),
  address: z.string().nullable(),
  rolesName: z.string().min(1, 'rolesName is required'),
  accessToken: z.string().nullable(),
  refreshToken: z.string().min(1, 'refresh token is required'),
  images: z.string().nullable()
});

export const userUpdateSchema = z.object({
  email: z.string().email('Invalid email address').nullable(),
  fullName: z.string().max(200, 'full name is too long').nullable(),
  address: z.string().nullable(),
  images: z.string().nullable()
});
