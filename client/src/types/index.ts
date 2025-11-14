export interface User {
  id: number;
  username: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
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
  userId: number;
  promptText: string;
  negativePrompt?: string;
  createdAt: string;
  updatedAt: string;
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
