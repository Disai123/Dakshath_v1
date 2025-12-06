import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(255, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  job_type: z.enum(['full-time', 'part-time', 'internship', 'contract']),
  location: z.string().optional(),
  department: z.string().optional(),
  required_score_min: z.number().min(0).max(100, 'Score must be between 0 and 100'),
  required_score_max: z.number().min(0).max(100).optional().nullable(),
  skill_requirements: z.array(z.string()).optional(),
  qualifications: z.string().optional(),
  salary_min: z.number().positive().optional().nullable(),
  salary_max: z.number().positive().optional().nullable(),
  experience_level: z.string().optional(),
  application_deadline: z.string().optional().nullable(),
  number_of_positions: z.number().int().positive().default(1),
  status: z.enum(['draft', 'active', 'closed']).default('draft')
});

export const applicationSchema = z.object({
  job_listing_id: z.number().int().positive(),
  cover_letter: z.string().optional(),
  notes: z.string().optional()
});

export const companySchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  location: z.string().optional()
});

