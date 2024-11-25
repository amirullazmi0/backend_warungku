import { z } from 'zod';

export class addressCreateRequest {
  active?: boolean;
  jalan?: string;
  rt?: string;
  rw?: string;
  kodepos?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
}

export class addressUpdateRequest {
  active?: boolean;
  jalan?: string;
  rt?: string;
  rw?: string;
  kodepos?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
}
export class addressCRUDResponse {
  id?: string;
  active?: boolean;
  jalan?: string;
  rt?: string;
  rw?: string;
  kodepos?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const addressCreateSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  jalan: z.string().min(1, 'jalan is required').max(255, 'jalan is too long'),
  rt: z.string().min(1, 'rt is required').max(255, 'rt is too long'),
  rw: z.string().min(1, 'rw is required').max(255, 'rw is too long'),
  kodepos: z.string().min(1, 'kodepon is required').max(255, 'kodepon is too long'),
  kelurahan: z.string().min(1, 'kelurahan is required').max(255, 'kelurahan is too long'),
  kecamatan: z.string().min(1, 'kecamatan is required').max(255, 'kecamatan is too long'),
  kota: z.string().min(1, 'kota is required').max(255, 'kota is too long'),
  provinsi: z.string().min(1, 'provinsi is required').max(255, 'provinsi is too long'),
});

export const addressUpdateSchema = z.object({
  active: z.boolean().nullable().optional(),
  jalan: z.string().min(1, 'jalan is required').max(255, 'jalan is too long').nullable().optional(),
  rt: z.string().min(1, 'rt is required').max(255, 'rt is too long').nullable().optional(),
  rw: z.string().min(1, 'rw is required').max(255, 'rw is too long').nullable().optional(),
  kodepos: z.string().min(1, 'kodepon is required').max(255, 'kodepon is too long').nullable().optional(),
  kelurahan: z.string().min(1, 'kelurahan is required').max(255, 'kelurahan is too long').nullable().optional(),
  kecamatan: z.string().min(1, 'kecamatan is required').max(255, 'kecamatan is too long').nullable().optional(),
  kota: z.string().min(1, 'kota is required').max(255, 'kota is too long').nullable().optional(),
  provinsi: z.string().min(1, 'provinsi is required').max(255, 'provinsi is too long').nullable().optional(),
});
