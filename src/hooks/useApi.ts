import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Product, Category, Message, LoginResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Query Keys
export const queryKeys = {
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  featuredProducts: ['products', 'featured'] as const,
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
  messages: ['messages'] as const,
  me: ['auth', 'me'] as const,
};

// Products Hooks
export const useProducts = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: () => api.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => api.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFeaturedProducts = (limit?: number) => {
  return useQuery({
    queryKey: [...queryKeys.featuredProducts, limit],
    queryFn: () => api.getFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (product: Partial<Product>) => api.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast({
        title: 'Başarılı!',
        description: 'Ürün başarıyla oluşturuldu.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Ürün oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      api.updateProduct(id, product),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
      toast({
        title: 'Başarılı!',
        description: 'Ürün başarıyla güncellendi.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Ürün güncellenirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast({
        title: 'Başarılı!',
        description: 'Ürün başarıyla silindi.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Ürün silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useReorderProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productOrders: { id: string; sortOrder: number }[]) =>
      api.reorderProducts(productOrders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast({
        title: 'Başarılı!',
        description: 'Ürün sıralaması güncellendi.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Sıralama güncellenirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

// Categories Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => api.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => api.getCategory(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (category: Partial<Category>) => api.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast({
        title: 'Başarılı!',
        description: 'Kategori başarıyla oluşturuldu.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Kategori oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

// Messages Hooks
export const useMessages = (params?: {
  page?: number;
  limit?: number;
  read?: boolean;
  replied?: boolean;
}) => {
  return useQuery({
    queryKey: [...queryKeys.messages, params],
    queryFn: () => api.getMessages(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useSendMessage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (message: { name: string; email: string; message: string }) =>
      api.sendMessage(message),
    onSuccess: () => {
      toast({
        title: 'Mesajınız gönderildi!',
        description: 'En kısa sürede size dönüş yapacağız.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Mesaj gönderilirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.markMessageAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
      toast({
        title: 'Başarılı!',
        description: 'Mesaj okundu olarak işaretlendi.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'İşlem sırasında bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

// Auth Hooks
export const useLogin = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      api.login(username, password),
    onSuccess: (response) => {
      if (response.success && response.data) {
        api.setToken(response.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        toast({
          title: 'Giriş başarılı!',
          description: 'Admin paneline yönlendiriliyorsunuz.',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Giriş hatası!',
        description: error.message || 'Kullanıcı adı veya şifre hatalı.',
        variant: 'destructive',
      });
    },
  });
};

// Additional Category CRUD Hooks

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: any }) =>
      api.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast({
        title: 'Başarılı!',
        description: 'Kategori başarıyla güncellendi.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Kategori güncellenirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast({
        title: 'Başarılı!',
        description: 'Kategori başarıyla silindi.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Hata!',
        description: error.message || 'Kategori silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      return api.logout(refreshToken || undefined);
    },
    onSuccess: () => {
      api.removeToken();
      queryClient.clear();
      toast({
        title: 'Çıkış yapıldı',
        description: 'Başarıyla çıkış yaptınız.',
      });
    },
    onError: (error: Error) => {
      // Even if logout fails, clear local data
      api.removeToken();
      queryClient.clear();
      toast({
        title: 'Çıkış yapıldı',
        description: 'Çıkış işlemi tamamlandı.',
      });
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => api.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


