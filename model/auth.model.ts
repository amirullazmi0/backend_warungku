import { z } from "zod"

export class authloginUserRequest {
    email: string
    password: string
}

export class authLoginUserResponse {
    email: string
    fullName: string
    accessToken: string
    refreshToken: string
    roles?: string
}

export const authLoginRequestSchema = z.object({
    email: z.string().min(1, 'email is required'),
    password: z.string().min(1, 'password is required'),
});