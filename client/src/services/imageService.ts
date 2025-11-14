import api from '../config/api';
import type { ImageGenerationRequest, ImageGenerationResponse } from '../types';

export const imageService = {
  async generateImage(data: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const response = await api.post<ImageGenerationResponse>('/images/generate', data);
    return response.data;
  },
};
