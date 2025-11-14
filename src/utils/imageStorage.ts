import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

/**
 * Save a base64 image string to a physical file in the uploads directory
 * @param base64Image - Base64 encoded image string (with or without data:image prefix)
 * @param filename - Optional custom filename (auto-generated if not provided)
 * @returns The relative path to the saved image
 */
export async function saveBase64Image(base64Image: string, filename?: string): Promise<string> {
  try {
    // Remove data:image/png;base64, prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Generate filename if not provided
    const imageName = filename || `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    // Define uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      await mkdirAsync(uploadsDir, { recursive: true });
    }
    
    // Full path to save the image
    const filePath = path.join(uploadsDir, imageName);
    
    // Write the buffer to file
    await writeFileAsync(filePath, imageBuffer);
    
    // Return the relative path for database storage
    return `/uploads/${imageName}`;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    throw new Error('Failed to save image file');
  }
}

/**
 * Save multiple base64 images
 * @param base64Images - Array of base64 encoded image strings
 * @returns Array of relative paths to saved images
 */
export async function saveBase64Images(base64Images: string[]): Promise<string[]> {
  const savePromises = base64Images.map(img => saveBase64Image(img));
  return Promise.all(savePromises);
}
