import fs from 'fs';
import path from 'path';

export interface StoredAdmin {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  password: string; // bcrypt hash
  role: string;
  accountStatus: string;
  emailVerified: boolean;
  createdAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE_PATH = path.resolve(DATA_DIR, 'users_db.json');

const ensureDataDirExists = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err: any) {
    console.warn('[ AdminStore Warning ] Could not create data directory:', err.message);
  }
};

export const loadAdminsFromDisk = (): Map<string, StoredAdmin> => {
  const adminMap = new Map<string, StoredAdmin>();
  try {
    ensureDataDirExists();
    if (fs.existsSync(FILE_PATH)) {
      const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
      const parsedList: StoredAdmin[] = JSON.parse(rawData);
      if (Array.isArray(parsedList)) {
        for (const item of parsedList) {
          if (item && item.email && item.password) {
            const cleanEmail = item.email.trim().toLowerCase();
            adminMap.set(cleanEmail, { ...item, email: cleanEmail });
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('[ AdminStore Error ] Failed to read users_db.json:', err.message);
  }
  return adminMap;
};

export const saveAdminsToDisk = (adminMap: Map<string, StoredAdmin>): void => {
  try {
    ensureDataDirExists();
    const list = Array.from(adminMap.values());
    fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[ AdminStore Error ] Failed to write users_db.json:', err.message);
  }
};
