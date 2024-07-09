import { z } from 'zod';

export class storeCreateRequest {
    email: string;
    fullName: string;
    logo?: string;
    password: string;
    bio?: string;
    address?: string;
    //   accessToken?: string;
    //   refreshToken: string;
}

export class storeUpdateRequest {
    email: string;
    fullName: string;
    logo?: string;
    bio?: string;
    address?: string;
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
    bio: z.string().optional(),
    address: z.string().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().min(1, 'refresh token is required'),
});

export const storeUpdateSchema = z.object({
    email: z.string().min(1, 'email is required').email('Invalid email address'),
    fullName: z
        .string()
        .min(1, 'full name is required')
        .max(200, 'full name is too long'),
    logo: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
});
