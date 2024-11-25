import { z } from 'zod';

export class storeCreateRequest {
    email: string;
    fullName: string;
    logo?: string;
    password: string;
    bio?: string;
    addressId?: string;
    //   accessToken?: string;
    //   refreshToken: string;
}

export class storeUpdateRequest {
    email: string;
    fullName: string;
    logo?: string;
    bio?: string;
    addressId?: string;
    //   accessToken?: string;
    //   refreshToken: string;
}

export class storeUpdatePasswordRequest {
    password: string
}
export class storeCRUDResponse {
    email: string;
    fullName: string;
    accessToken?: string;
    refreshToken?: string;
}

export const storeCreateSchema = z.object({
    email: z.string().min(1, 'email is required').email('Invalid email address'),
    fullName: z
        .string()
        .min(1, 'full name is required')
        .max(200, 'full name is too long'),
    logo: z.string().optional(),
    password: z.string().min(1, 'password is required'),
    bio: z.string().nullable().optional(),
    addressId: z.string().nullable().optional(),
    accessToken: z.string().nullable().optional(),
    refreshToken: z.string().min(1, 'refresh token is required'),
});

export const storeUpdateSchema = z.object({
    email: z.string().min(1, 'email is required').email('Invalid email address').nullable().optional(),
    fullName: z
        .string()
        .min(1, 'full name is required')
        .max(200, 'full name is too long')
        .nullable().optional(),
    logo: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
});
