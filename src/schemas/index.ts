import { z } from 'zod';
import { SPECIES, SEX_OPTIONS } from '@/constants';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  displayName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'passwords_must_match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const petSchema = z.object({
  name: z.string().min(1).max(50),
  species: z.enum(SPECIES as unknown as [string, ...string[]]),
  breed: z.string().max(80).optional(),
  sex: z.enum(SEX_OPTIONS as unknown as [string, ...string[]]),
  ageMonths: z.number().min(0).max(300).optional(),
  weightKg: z.number().min(0).max(200).optional(),
  color: z.string().max(80).optional(),
  personalityNotes: z.string().max(500).optional(),
  medicalNotes: z.string().max(500).optional(),
  allergies: z.string().max(200).optional(),
  microchipId: z.string().max(50).optional(),
});

export const caseContactSchema = z.object({
  showPhone: z.boolean(),
  showWhatsApp: z.boolean(),
  phone: z.string().optional(),
  whatsApp: z.string().optional(),
  preferredMethod: z.enum(['whatsapp', 'phone', 'in_app']),
});

export const locationSchema = z.object({
  province: z.string().min(1),
  city: z.string().min(1),
  neighborhood: z.string().optional(),
  addressText: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export const createLostCaseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  location: locationSchema,
  contact: caseContactSchema,
  lastSeenAt: z.date(),
});

export const createFoundCaseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  location: locationSchema,
  contact: caseContactSchema,
  foundAt: z.date(),
  temporaryCare: z.enum(['with_finder', 'shelter', 'street', 'vet', 'foster']),
});

export const createAdoptionCaseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  location: locationSchema,
  contact: caseContactSchema,
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  healthStatus: z.string().max(200).optional(),
  personality: z.string().max(500).optional(),
});

export const createTransitCaseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  location: locationSchema,
  contact: caseContactSchema,
  transitStartAt: z.date(),
  temporaryCare: z.enum(['with_finder', 'shelter', 'street', 'vet', 'foster']),
  needsHome: z.boolean(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type PetForm = z.infer<typeof petSchema>;
