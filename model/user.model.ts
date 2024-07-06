import { z } from 'zod';

export class userCreateRequest {
  email: string;
  fullName: string;
  images?: string;
  password: string;
  address?: string;
  //   rolesName?: string;
  //   accessToken?: string;
  //   refreshToken: string;
}

export class userUpdateRequest {
  email?: string;
  fullName?: string;
  images?: string;
  address?: string;
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
  fullName: z
    .string()
    .min(1, 'full name is required')
    .max(200, 'full name is too long'),
  images: z.string().optional(),
  password: z.string().min(1, 'password is required'),
  address: z.string().optional(),
  rolesName: z.string().min(1, 'rolesName is required'),
  accessToken: z.string().optional(),
  refreshToken: z.string().min(1, 'refresh token is required'),
});

export const userUpdateSchema = z.object({
  email: z.string().min(1, 'email is required').email('Invalid email address'),
  fullName: z
    .string()
    .min(1, 'full name is required')
    .max(200, 'full name is too long'),
  images: z.string().optional(),
  address: z.string().optional(),
});
