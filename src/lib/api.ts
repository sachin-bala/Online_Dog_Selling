const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_API_BASE_URL || import.meta.env.NEXT_PUBLIC_API_URL
    : undefined) || 'http://localhost:5000/api';

console.log('[PAWVERSE API] Base URL:', API_BASE_URL);

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('pawverse_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Request Failed');
  }
  return data;
};

export const api = {
  // Health check
  getHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await handleResponse(res);
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        throw new Error('Unable to connect to the PawVerse API server.');
      }
      throw err;
    }
  },

  // Auth
  register: async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  adminLogin: async (credentials: any) => {
    console.log('[PAWVERSE API] [ADMIN LOGIN] POST /api/admin/login');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return await handleResponse(res);
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        throw new Error('Unable to connect to the PawVerse API server.');
      }
      throw err;
    }
  },

  adminRegister: async (payload: any) => {
    console.log('[PAWVERSE API] [ADMIN REGISTER] POST /api/admin/register');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(payload),
      });
      return await handleResponse(res);
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        throw new Error('Unable to connect to the PawVerse API server.');
      }
      throw err;
    }
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getUserProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  updateUserProfile: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  changePassword: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  verifyOtp: async (otp: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ otp }),
    });
    return handleResponse(res);
  },

  // Cart
  getCart: async () => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  addToCart: async (dogId: string, quantity: number = 1) => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ dogId, quantity }),
    });
    return handleResponse(res);
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const res = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(res);
  },

  removeFromCart: async (itemId: string) => {
    const res = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  clearCart: async () => {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Seller
  registerSeller: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/sellers/register`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse(res);
  },

  getSellerStatus: async () => {
    const res = await fetch(`${API_BASE_URL}/sellers/status`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getSellerDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/sellers/dashboard-stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getAdminSellers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/sellers`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getAdminDogs: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/dogs`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getAdminOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getAdminPayments: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/payments`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getPendingSellers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/pending-sellers`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  approveSeller: async (sellerId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}/approve`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  rejectSeller: async (sellerId: string, reason: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/sellers/${sellerId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },

  getPendingDogs: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/pending-dogs`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  approveDog: async (dogId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/dogs/${dogId}/approve`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  rejectDog: async (dogId: string, reason: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/dogs/${dogId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },

  updateUserStatus: async (userId: string, status: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  approveDogOrder: async (orderId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  dispatchDogOrder: async (orderId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  rejectDogOrder: async (orderId: string, reason?: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ reason: reason || 'Information check failed' }),
    });
    return handleResponse(res);
  },

  approveOrderPayment: async (orderId: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/approve-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  cancelDogOrder: async (orderId: string, reason?: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ reason: reason || 'Cancelled by Admin' }),
    });
    return handleResponse(res);
  },

  // Dogs
  getDogs: async (queryParams: string = '') => {
    const res = await fetch(`${API_BASE_URL}/dogs${queryParams ? `?${queryParams}` : ''}`);
    return handleResponse(res);
  },

  getDogById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/dogs/${id}`);
    return handleResponse(res);
  },

  createDogListing: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/dogs`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return handleResponse(res);
  },

  updateDogListing: async (id: string, dogData: any) => {
    const res = await fetch(`${API_BASE_URL}/dogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(dogData),
    });
    return handleResponse(res);
  },

  deleteDogListing: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/dogs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Payments & Orders
  createOrderPayment: async (orderPayload: any) => {
    const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(orderPayload),
    });
    return handleResponse(res);
  },

  verifyPayment: async (paymentPayload: any) => {
    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(paymentPayload),
    });
    return handleResponse(res);
  },

  getCustomerOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  getPetPassports: async () => {
    const res = await fetch(`${API_BASE_URL}/users/pet-passports`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Dog Shows — public endpoint, no auth required to view
  getDogShows: async () => {
    const res = await fetch(`${API_BASE_URL}/dog-shows`);
    return handleResponse(res);
  },

  createDogShow: async (showData: any) => {
    const isFormData = typeof FormData !== 'undefined' && showData instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/dog-shows`, {
      method: 'POST',
      headers: isFormData ? { ...getAuthHeader() } : { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: isFormData ? showData : JSON.stringify(showData),
    });
    return handleResponse(res);
  },

  updateDogShow: async (showId: string, showData: any) => {
    const isFormData = typeof FormData !== 'undefined' && showData instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/dog-shows/${showId}`, {
      method: 'PUT',
      headers: isFormData ? { ...getAuthHeader() } : { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: isFormData ? showData : JSON.stringify(showData),
    });
    return handleResponse(res);
  },

  deleteDogShow: async (showId: string) => {
    const res = await fetch(`${API_BASE_URL}/dog-shows/${showId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  registerForShow: async (showId: string, participantData: any) => {
    const res = await fetch(`${API_BASE_URL}/dog-shows/${showId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(participantData),
    });
    return handleResponse(res);
  },

  // AI Service
  getBreedRecommendation: async (input: any) => {
    const res = await fetch(`${API_BASE_URL}/ai/breed-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse(res);
  },

  sendAiChat: async (message: string) => {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return handleResponse(res);
  },

  runBatchDatasetTest: async (dataset?: any) => {
    const res = await fetch(`${API_BASE_URL}/ai/batch-test-dataset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset }),
    });
    return handleResponse(res);
  },

  // Wishlist
  getWishlist: async () => {
    const res = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  addToWishlist: async (dogId: string) => {
    const res = await fetch(`${API_BASE_URL}/wishlist/${dogId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  removeFromWishlist: async (dogId: string) => {
    const res = await fetch(`${API_BASE_URL}/wishlist/${dogId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Dog Foods & Dog Accessories (Admin-Only Managed)
  getProducts: async (queryParams: string = '') => {
    const res = await fetch(`${API_BASE_URL}/products${queryParams ? `?${queryParams}` : ''}`);
    return handleResponse(res);
  },

  getProductById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(res);
  },

  createProduct: async (productData: any) => {
    const isFormData = productData instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: isFormData ? { ...getAuthHeader() } : { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: isFormData ? productData : JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  updateProduct: async (id: string, productData: any) => {
    const isFormData = productData instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: isFormData ? { ...getAuthHeader() } : { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: isFormData ? productData : JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};
