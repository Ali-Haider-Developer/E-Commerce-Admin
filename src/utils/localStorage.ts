export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly PRODUCTS_KEY = 'ecommerce_products';
  private readonly ORDERS_KEY = 'ecommerce_orders';

  private constructor() {}

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Products
  getProducts(): Product[] {
    if (typeof window === 'undefined') return [];
    const products = localStorage.getItem(this.PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  }

  setProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
    };
    products.push(newProduct);
    this.setProducts(products);
    return newProduct;
  }

  updateProduct(id: string, product: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...product };
    this.setProducts(products);
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filteredProducts = products.filter((p) => p.id !== id);
    this.setProducts(filteredProducts);
    return products.length !== filteredProducts.length;
  }

  // Orders
  getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    const orders = localStorage.getItem(this.ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  }

  setOrders(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder = {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    this.setOrders(orders);
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    orders[index] = { ...orders[index], status };
    this.setOrders(orders);
    return orders[index];
  }
}

export const localStorageService = LocalStorageService.getInstance(); 