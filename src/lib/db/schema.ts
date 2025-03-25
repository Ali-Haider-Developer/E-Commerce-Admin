import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: 'active' | 'inactive';
  images: string[];
  variants?: {
    size: string;
    color: string;
    stock: number;
    price?: number;
  }[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  id: string;
  type: 'hero' | 'feature' | 'testimonial';
  title?: string;
  description?: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default prisma; 