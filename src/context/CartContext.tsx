'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, qty?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: any, qty = 1) => {
        setCart((prev) => {
            const existing = prev.find((i) => i._id === product._id);
            if (existing) {
                return prev.map((i) =>
                    i._id === product._id ? { ...i, quantity: i.quantity + qty } : i
                );
            }
            return [...prev, { ...product, quantity: qty }];
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCart((prev) => prev.filter((i) => i._id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((i) => (i._id === id ? { ...i, quantity: i.quantity + delta } : i))
                .filter((i) => i.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
};