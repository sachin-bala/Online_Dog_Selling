import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string = 'pawverse_dogs',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto',
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== '1234567890';

  // If real Cloudinary keys are configured, upload to Cloudinary CDN
  if (isCloudinaryConfigured) {
    try {
      return await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) return reject(error);
            if (result && result.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(new Error('Cloudinary upload returned empty response'));
            }
          }
        );

        uploadStream.end(buffer);
      });
    } catch (err: any) {
      console.warn('[ Cloudinary Upload Failed ] Falling back to local data URL:', err?.message || err);
    }
  }

  // Local Development / Demo Mode: Preserve the admin's exact selected image!
  if (buffer && buffer.length > 0) {
    // 1. Also save locally to uploads/ directory for disk persistence
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
      const filename = `dog_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`[ Image Service ] Saved uploaded image to disk: ${filePath}`);
    } catch (diskErr) {
      console.warn('[ Image Service ] Could not write to disk:', diskErr);
    }

    // 2. Return data URL so image works 100% reliably in any browser / client without URL mismatches
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  }

  // Fallback placeholder only if buffer is completely empty
  return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80';
};

