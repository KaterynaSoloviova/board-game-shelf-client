// Environment variables with fallbacks
export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5005";
export const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dtjylc9ny/image/upload";
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "wombat-kombat";

// Environment
export const NODE_ENV = import.meta.env.NODE_ENV || "development";
export const IS_DEVELOPMENT = NODE_ENV === "development";
export const IS_PRODUCTION = NODE_ENV === "production";
