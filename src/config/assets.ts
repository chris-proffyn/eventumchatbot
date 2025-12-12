/**
 * Asset URLs for Annabel Chatbot
 * 
 * These assets are hosted on S3 at eventumortho.click to ensure
 * they load correctly when the chatbot is embedded into external websites.
 * Using absolute URLs prevents 404 errors when the chatbot is embedded
 * into sites that don't have these assets.
 */

// Base URL for Annabel chatbot assets hosted on S3
export const ANNABEL_ASSET_BASE_URL = "https://eventumortho.click";

// Logo URLs
export const ANNABEL_COLOUR_LOGO_URL = `${ANNABEL_ASSET_BASE_URL}/evielogo.svg`;
export const ANNABEL_MONO_LOGO_URL = `${ANNABEL_ASSET_BASE_URL}/eviemonologo.svg`;

