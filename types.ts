// FIX: Removed self-import of 'Product' which conflicts with local declaration of 'Product'.
export interface Image {
  url: string;
  alt: string;
}

export interface Ratings {
  average: number;
  count: number;
}

export interface Category {
  id: string;
  nameAr: string;
  slug: string;
  image: string;
}

export interface SubCategory {
  id: string;
  nameAr: string;
  slug: string;
  mainCategoryId: string;
}

export interface Product {
  id: string;
  nameAr: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  subCategory: SubCategory;
  images: Image[];
  ratings: Ratings;
  isNew: boolean;
  isBestseller: boolean;
  colors?: string[];
  stock: number;
  weight?: number; // in kg
  dimensions?: string; // e.g., "20cm x 15cm"
  material?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type PaymentMethod = 'cod';

export interface Order {
  id: string;
  userId?: string; // Link order to a user
  customerName: string;
  address: string;
  phone: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  paymentMethod: PaymentMethod;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    sender: 'user' | 'admin';
    text: string;
    timestamp: number;
    status?: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
    id: string; // Corresponds to userId
    userName: string;
    lastMessage: string;
    lastTimestamp: number;
    unreadUser: number;
    unreadAdmin: number;
    isUserTyping?: boolean;
    isAdminTyping?: boolean;
}

export type Page = 'home' | 'products' | 'productDetail' | 'deals' | 'cart' | 'checkout' | 'orderConfirmation' | 'admin' | 'ordersHistory' | 'wishlist' | 'auth' | 'privacy' | 'about' | 'terms';

// --- Dynamic Homepage Content Types ---

export interface BannerContent {
    enabled: boolean;
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    link: Page | string; // Can be a page slug or a category ID
    linkType: 'page' | 'category';
    layout: 'text-left' | 'text-center' | 'text-right';
}

export interface HeroSection {
  type: 'hero';
  enabled: boolean;
  banners: BannerContent[];
}

export interface CategoryGridSection {
  type: 'categoryGrid';
  enabled: boolean;
  title: string;
  categoryIds: string[];
}

export interface ProductCarouselSection {
  type: 'productCarousel';
  enabled: boolean;
  title: string;
  filter: 'bestseller' | 'new' | 'sale';
  layout: 'default' | 'stacked-card';
  linkToPage: Page;
}

export interface PromoBannerSection {
  type: 'promoBanner';
  enabled: boolean;
  bannerType: 'full' | 'split';
  content: BannerContent;
}

export type HomePageSection = (HeroSection | CategoryGridSection | ProductCarouselSection | PromoBannerSection) & { id: string };

export interface SiteContent {
    homepage: {
        sections: HomePageSection[];
    };
    dealsPage: {
        bestDealProductId: string | null;
    };
}