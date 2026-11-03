import { z } from 'zod';

export const bangladeshPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

export function normalizeBangladeshPhone(rawPhone: string): string {
  const cleaned = rawPhone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('01')) {
    return `+88${cleaned}`;
  }
  if (cleaned.startsWith('8801')) {
    return `+${cleaned}`;
  }
  return cleaned;
}

export const phoneAuthSchema = z.object({
  phone: z
    .string()
    .min(11, 'Phone number must be at least 11 digits')
    .regex(bangladeshPhoneRegex, 'Enter a valid Bangladesh mobile number (e.g. 017XXXXXXXX or +88017XXXXXXXX)')
    .transform(normalizeBangladeshPhone)
});

export const otpVerifySchema = z.object({
  phone: z.string().transform(normalizeBangladeshPhone),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must only contain digits')
});

export const emailLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const donorRegistrationSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  phone: z.string().regex(bangladeshPhoneRegex, 'Enter a valid Bangladesh mobile number').transform(normalizeBangladeshPhone),
  email: z.string().email().optional().or(z.literal('')),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).default('prefer_not_to_say'),
  divisionId: z.string().uuid('Please select a valid division'),
  districtId: z.string().uuid('Please select a valid district'),
  upazilaOrThanaId: z.string().uuid().optional().nullable(),
  weightKg: z.number().min(45, 'Donor weight must be at least 45kg').max(200).optional().nullable(),
  lastDonationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  publicDiscoveryConsent: z.boolean().default(true),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms of service and donor safety consent' })
  })
});

export const emergencyBloodRequestSchema = z.object({
  patientInitials: z.string().min(2, 'Initials/Identifier required').max(50),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+']),
  component: z.string().default('whole_blood'),
  unitsNeeded: z.number().int().min(1, 'Minimum 1 unit').max(10, 'Maximum 10 units per request'),
  urgency: z.enum(['routine', 'urgent', 'critical_emergency']),
  hospitalName: z.string().min(3, 'Hospital name is required'),
  districtId: z.string().uuid('District is required'),
  hospitalAddress: z.string().min(5, 'Hospital address is required'),
  requiredDatetime: z.string().min(10, 'Required date and time is required'),
  requesterPhone: z.string().regex(bangladeshPhoneRegex, 'Enter valid contact phone').transform(normalizeBangladeshPhone),
  description: z.string().max(500).optional(),
  contactConsent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted by matched donors and hospital staff' })
  })
});

export const donationSubmissionSchema = z.object({
  donorId: z.string().uuid(),
  donationTypeId: z.string().default('whole_blood'),
  hospitalId: z.string().uuid().optional().nullable(),
  donationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  units: z.number().int().min(1).max(2).default(1),
  bagNumber: z.string().max(100).optional().nullable(),
  evidenceDocumentUrl: z.string().url().optional().nullable()
});
