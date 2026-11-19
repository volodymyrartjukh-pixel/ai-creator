import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// ── Request schema ──────────────────────────────────────────────────────────
const orderRequestSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  productName: z.string().min(1, 'productName is required'),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100)
    .transform((v) => v.trim()),
  email: z
    .string()
    .email('Invalid email')
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .max(20)
    .regex(/^[+\d\s\-().]*$/, 'Invalid phone')
    .optional()
    .or(z.literal('')),
  quantity: z.number().int().min(1).max(99),
  deliveryAddress: z
    .string()
    .min(1, 'Delivery address is required')
    .max(300)
    .transform((v) => v.trim()),
  notes: z.string().max(500).optional().or(z.literal('')),
});

// ── POST /api/orders ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Basic content-type guard
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { success: false, message: 'Content-Type must be application/json' },
      { status: 415 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const parsed = orderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // ── Persist / forward the order here ─────────────────────────────────────
  // In a real app: await db.orders.create({ data })
  // For now we return a generated orderId to satisfy the contract.
  const orderId = uuidv4();

  console.info('[orders] New order created', {
    orderId,
    productId: data.productId,
    email: data.email,
    quantity: data.quantity,
  });

  return NextResponse.json({ success: true, orderId }, { status: 201 });
}
