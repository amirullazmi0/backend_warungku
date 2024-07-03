import { z } from "zod";

export class rolesCreateRequest {
    name: string
}

export class rolesCRUDResponse {
    name: string
}

export const rolesCreateSchema = z.object({
    email: z.string().min(1, 'roles name is required').max(255, 'roles name too long'),
});