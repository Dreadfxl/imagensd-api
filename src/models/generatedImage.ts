export interface GeneratedImage {
  id: number;
  user_id: number;
  prompt_id?: number;
  image_url: string;
  thumbnail_url?: string;
  prompt_used: string;
  generation_params?: any;
  created_at: Date;
}

export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  style?: string;
  prompt_id?: number;
  source?: 'local' | 'external';
  batch_size?: number;
}
