import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const { CLOUD_NAME, CLOUDINARY_APY_KEY, CLOUDINARY_APY_SECRET } = process.env;

cloudinary.config({ 
  cloud_name: CLOUD_NAME, 
  api_key: CLOUDINARY_APY_KEY, 
  api_secret: CLOUDINARY_APY_SECRET
});

export default cloudinary;