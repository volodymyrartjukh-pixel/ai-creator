import { z } from 'zod';

export const orderSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be 100 characters or fewer'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone number must be 20 characters or fewer')
    .regex(/^[+\d\s\-().]*$/, 'Phone number contains invalid characters')
    .optional()
    .or(z.literal('')),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99'),
  deliveryAddress: z
    .string()
    .min(1, 'Delivery address is required')
    .max(300, 'Delivery address must be 300 characters or fewer'),
  notes: z
    .string()
    .max(500, 'Notes must be 500 characters or fewer')
    .optional()
    .or(z.literal('')),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
