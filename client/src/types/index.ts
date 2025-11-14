export interface User {
  id: number;
  username: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Prompt {
  id: number;
  user_id: number;
  title: string;
  prompt_text: string;
  negative_prompt?: string;
  style?: string;
  created_at: string;
  updated_at: string;
}

export interface ImageGenerationRequest {
  promptText: string;
  negativePrompt?: string;
  steps?: number;
  cfgScale?: number;
}

export interface GeneratedImage {
  url: string;
  path: string;
}

export interface ImageGenerationResponse {
  message: string;
  images: GeneratedImage[];
}
