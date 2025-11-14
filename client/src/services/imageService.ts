import api from '../config/api';
import type { ImageGenerationRequest, ImageGenerationResponse } from '../types';

export const imageService = {
  async generateImage(data: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // Transform frontend format to backend format
    const backendPayload = {
      prompt: data.promptText,
      negative_prompt: data.negativePrompt || '',
      steps: data.steps,
      cfgScale: data.cfgScale,
    };
    
    const response = await api.post('/images/generate', backendPayload);
    
    // Transform backend response to frontend format
    const images = response.data.map((img: any) => ({
      url: img.image_path,
      path: img.image_path,
    }));
    
    return {
      message: 'Images generated successfully',
      images,
    };
  },
};
