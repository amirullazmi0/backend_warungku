import { z } from "zod"

export class AuthLoginRequestDTO {
    email: string
    password: string
}

export class AuthRegisterRequestDTO {
    email: string
    fullName: string
    password: string
}

export class AuthLoginResponseDTO{
    fullName: string
    email: string
    accessToken: string
    refreshToken: string
}

export const authLoginRequestSchema = z.object({
    email: z.string().min(1, 'email is required'),
    password: z.string().min(1, 'password is required'),
});