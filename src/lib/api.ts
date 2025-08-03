// API Base URL
export const API_BASE_URL = 'http://localhost:3000/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  material?: string;
  dimensions?: string;
  variants: Array<{
    color: string;
    colorCode: string;
    images: string[];
    stock: { quantity: number };
  }>;
  specifications?: {
    // Genel özellikler
    warranty?: string;
    origin?: string;
    features?: string[];
    guaranteeType?: string;
    importerGuarantee?: string;

    // Radyo spesifik özellikler
    model?: string;
    radioFrequency?: string;
    musicInputs?: string;
    mp3Support?: string;
    battery?: string;
    chargingTime?: string;
    solarPanel?: string;
    lightEffect?: string;
    antenna?: string;
    receiver?: string;
    speaker?: string;
    connections?: string;
    bluetooth?: string;

    // Nemlendirici spesifik özellikler
    powerInput?: string;
    tankCapacity?: string;
    vaporOutput?: string;
    weight?: string;
    material?: string;
    functions?: string;
    timer?: string;
    essentialOilCompatible?: string;
    remoteControl?: string;
    powerProtection?: string;

    // Kamp Lambası spesifik özellikler
    interface?: string;
    inputVoltage?: string;
    ledPower?: string;
    speakerPower?: string;
    frequencyResponse?: string;
    bluetoothRange?: string;
    bluetoothVersion?: string;
    batteryCapacity?: string;
    colorfulLight?: string;
    nightLight?: string;
    touchSwitch?: string;
    soundEffects?: string;
    endurance?: string;
  };
  safetyInfo?: {
    ageRestriction?: string;
    warnings?: string[];
  };
  stock?: {
    quantity?: number;
    minStock?: number;
    maxStock?: number;
    unit?: string;
    location?: string;
    supplier?: string;
    costPrice?: number;
    salePrice?: number;
    lastRestocked?: string;
    notes?: string;
  };
  featured: boolean;
  active: boolean;
  sortOrder?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

// Sale Types
export interface SaleItem {
  product: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export interface Sale {
  _id: string;
  saleNumber: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    taxNumber?: string;
    companyName?: string;
  };
  items: SaleItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  saleStatus: string;
  notes?: string;
  saleDate: string;
  dueDate?: string;
  deliveryDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Message Types
export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  replied: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
}

// Admin Types
export interface Admin {
  _id: string;
  username: string;
  name?: string;
  role: 'admin' | 'super_admin';
  active: boolean;
  lastLogin?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse {
  admin: Admin;
  tokens: AuthTokens;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('accessToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Products API
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured) searchParams.append('featured', 'true');

    const query = searchParams.toString();
    return this.request<Product[]>(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]>> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<Product[]>(`/products/featured${query}`);
  }

  async createProduct(product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderProducts(productOrders: { id: string; sortOrder: number }[]): Promise<ApiResponse> {
    return this.request('/products/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ productOrders }),
    });
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages API
  async sendMessage(message: {
    name: string;
    email: string;
    message: string;
  }): Promise<ApiResponse> {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getMessages(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    replied?: boolean;
  }): Promise<ApiResponse<Message[]>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.read !== undefined) searchParams.append('read', params.read.toString());
    if (params?.replied !== undefined) searchParams.append('replied', params.replied.toString());

    const query = searchParams.toString();
    return this.request<Message[]>(`/messages${query ? `?${query}` : ''}`);
  }

  async markMessageAsRead(id: string): Promise<ApiResponse> {
    return this.request(`/messages/${id}/read`, {
      method: 'PATCH',
    });
  }

  // Auth API
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(refreshToken?: string): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe(): Promise<ApiResponse<Admin>> {
    return this.request<Admin>('/auth/me');
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    return this.request<{ tokens: AuthTokens }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);

// Export individual API functions for convenience
export const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  sendMessage,
  getMessages,
  markMessageAsRead,
  login,
  logout,
  getMe,
  refreshToken,
  healthCheck,
} = api;
