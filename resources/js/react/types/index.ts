export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    company?: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state?: string;
    country: string;
    pincode: string;
    is_default_billing: boolean;
    is_default_shipping: boolean;
}

export interface Review {
    id: number;
    user_id?: number | null;
    guest_name?: string;
    guest_email?: string;
    product_id: number;
    rating: number;
    title: string;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    is_verified_purchase: boolean;
    created_at: string;
    user?: User;
    images?: { id: number; image_path: string }[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    total: number;
    product_name?: string;
    product?: {
        name: string;
        image: string;
        slug: string;
        image_url?: string;
    };
}

export interface Order {
    id: number;
    user_id: number;
    status: string;
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    payment_method: string;
    created_at: string;
    order_number?: string;
    customer_order_number?: string;
    encrypted_order_id?: string;
    payment_status?: string;

    // Address Details
    name?: string;
    email?: string;
    phone?: string;
    shipping_address?: any; // Ideally this should match Address interface but lenient for now
    billing_address?: any;

    items?: OrderItem[];
    order_items?: OrderItem[];
    // Relationships
    transactions?: any[];
    shipments?: any[];
    invoices?: any[];
    refunds?: any[];
}
