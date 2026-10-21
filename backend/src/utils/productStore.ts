import fs from 'fs';
import path from 'path';

export interface StoredProduct {
  id: string;
  _id?: string;
  name: string;
  type: 'FOOD' | 'ACCESSORY';
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  weight?: string;
  lifeStage?: string;
  material?: string;
  size?: string;
  images: string[];
  description: string;
  features: string[];
  ingredients?: string;
  isAvailable: boolean;
  featured: boolean;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE_PATH = path.resolve(DATA_DIR, 'products_db.json');

const ensureDataDirExists = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err: any) {
    console.warn('[ ProductStore Warning ] Could not create data directory:', err.message);
  }
};

export const loadProductsFromDisk = (): StoredProduct[] => {
  try {
    ensureDataDirExists();
    if (fs.existsSync(FILE_PATH)) {
      const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
      const list: StoredProduct[] = JSON.parse(rawData);
      if (Array.isArray(list)) {
        return list;
      }
    }
  } catch (err: any) {
    console.warn('[ ProductStore Error ] Failed to read products_db.json:', err.message);
  }
  return [];
};

export const saveProductsToDisk = (products: StoredProduct[]): void => {
  try {
    ensureDataDirExists();
    fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[ ProductStore Error ] Failed to write products_db.json:', err.message);
  }
};
