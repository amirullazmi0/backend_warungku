import { z } from 'zod';

export class userCreateRequestDTO {
  email: string;
  fullName: string;
  password: string;
}

export class userUpdateRequest {
  email?: string;
  fullName?: string;
  addressId?: string;
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
  fullName: z
    .string()
    .min(1, 'full name is required')
    .max(200, 'full name is too long'),
  password: z.string().min(1, 'password is required'),
  addressId: z.string().nullable().optional(),
  rolesName: z.string().min(1, 'rolesName is required'),
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().min(1, 'refresh token is required'),
  images: z.string().nullable().optional(),
});

export const userUpdateSchema = z.object({
  email: z.string().email('Invalid email address').nullable().optional(),
  fullName: z.string().max(200, 'full name is too long').nullable().optional(),
  addressId: z.string().nullable().optional(),
  images: z.string().nullable().optional(),
});
