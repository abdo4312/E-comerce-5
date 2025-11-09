import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import { Product, CartItem } from '../types';
import { User } from '@supabase/supabase-js';

const GUEST_CART_KEY = 'stationery_guest_cart';

interface CartState {
  items: CartItem[];
  isInitialized: boolean;
  actions: {
    addToCart: (product: Product, quantity: number) => { success: boolean; message: string };
    updateQuantity: (productId: string, newQuantity: number, stock: number) => { success: boolean; message: string };
    removeFromCart: (productId: string, productName: string) => { success: boolean; message: string };
    clearCart: (user?: User | null) => void;
    loadGuestCart: () => void;
    mergeAndSyncCarts: (user: User) => Promise<void>;
    initializeCart: (user: User | null) => Promise<void>;
  };
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isInitialized: false,
  actions: {
    initializeCart: async (user) => {
        if (get().isInitialized) return;
        if (user) {
            await get().actions.mergeAndSyncCarts(user);
        } else {
            get().actions.loadGuestCart();
        }
        set({ isInitialized: true });
    },
    addToCart: (product, quantity) => {
      if (product.stock < 1) {
        return { success: false, message: "عذراً، هذا المنتج نفذ من المخزون." };
      }

      const currentItems = get().items;
      const existingItem = currentItems.find(item => item.productId === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          return { success: false, message: `لا يمكن إضافة المزيد. لديك ${existingItem.quantity} بالفعل والكمية المتاحة هي ${product.stock} فقط.` };
        }
        const newItems = currentItems.map(item =>
          item.productId === product.id ? { ...item, quantity: newQuantity } : item
        );
        set({ items: newItems });
      } else {
        if (quantity > product.stock) {
          return { success: false, message: `الكمية المطلوبة غير متوفرة. المتاح: ${product.stock}` };
        }
        const newItems = [...currentItems, { productId: product.id, quantity }];
        set({ items: newItems });
      }
      return { success: true, message: `تمت إضافة "${product.nameAr}" إلى السلة!` };
    },
    updateQuantity: (productId, newQuantity, stock) => {
        if (newQuantity <= 0) {
            get().actions.removeFromCart(productId, "المنتج");
            return { success: true, message: "" };
        }
        if (newQuantity > stock) {
            return { success: false, message: `الكمية المطلوبة غير متوفرة. المتاح: ${stock}` };
        }
        const newItems = get().items.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        set({ items: newItems });
        return { success: true, message: "" };
    },
    removeFromCart: (productId, productName) => {
        const newItems = get().items.filter(item => item.productId !== productId);
        set({ items: newItems });
        return { success: true, message: `تمت إزالة "${productName}" من السلة.` };
    },
    clearCart: (user) => {
        set({ items: [] });
         if (user) {
            supabase.from('user_carts').delete().match({ user_id: user.id });
        } else {
            localStorage.removeItem(GUEST_CART_KEY);
        }
    },
    loadGuestCart: () => {
      const guestCartJSON = localStorage.getItem(GUEST_CART_KEY);
      const guestCart: CartItem[] = guestCartJSON ? JSON.parse(guestCartJSON) : [];
      set({ items: guestCart });
    },
    mergeAndSyncCarts: async (user) => {
        const { data, error } = await supabase.from('user_carts').select('items').eq('user_id', user.id).single();
        if (error && error.code !== 'PGRST116') { // Ignore "No rows found" error
            console.error("Error fetching DB cart:", error);
            return;
        }

        const dbCart: CartItem[] = data?.items || [];
        const guestCartJSON = localStorage.getItem(GUEST_CART_KEY);
        const guestCart: CartItem[] = guestCartJSON ? JSON.parse(guestCartJSON) : [];

        if (guestCart.length > 0) {
            const mergedCartMap = new Map(dbCart.map(item => [item.productId, item.quantity]));
            guestCart.forEach(guestItem => {
                const currentQuantity = mergedCartMap.get(guestItem.productId) || 0;
                mergedCartMap.set(guestItem.productId, currentQuantity + guestItem.quantity);
            });
            const mergedCart = Array.from(mergedCartMap, ([productId, quantity]) => ({ productId, quantity }));
            set({ items: mergedCart });
            localStorage.removeItem(GUEST_CART_KEY);
        } else {
            set({ items: dbCart });
        }
    }
  }
}));

// Sync middleware
useCartStore.subscribe(async (state, prevState) => {
    // This function will be called on every state change.
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (user) {
        // Debounce or throttle this in a real app to avoid excessive writes
        if(state.items !== prevState.items) {
           await supabase.from('user_carts').upsert({ user_id: user.id, items: state.items });
        }
    } else {
         if(state.items !== prevState.items) {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(state.items));
         }
    }
});

export const useCartActions = () => useCartStore((state) => state.actions);
export const useCartItems = () => useCartStore((state) => state.items);

export default useCartStore;
