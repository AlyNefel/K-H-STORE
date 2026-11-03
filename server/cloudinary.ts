import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'hack-services',
  api_key: process.env.CLOUDINARY_API_KEY || '894797175975672',
  api_secret: process.env.CLOUDINARY_API_SECRET || '0iu9RY8YEN-ZeXzrvIvFaQD5TGk',
  secure: true
});

export async function uploadImageToCloudinary(base64OrUrl: string, folder = 'kh_store/products') {
  try {
    const result = await cloudinary.uploader.upload(base64OrUrl, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1400, crop: 'limit' }
      ]
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Image upload failed'
    };
  }
}

export default cloudinary;
