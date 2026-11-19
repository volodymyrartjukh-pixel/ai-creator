export interface OrderPayload {
  productId: string;
  productName: string;
  fullName: string;
  email: string;
  phone?: string;
  quantity: number;
  deliveryAddress: string;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
}
