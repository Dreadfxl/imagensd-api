import api from '../config/api';
import type { Prompt } from '../types';

export const promptService = {
  async getPrompts(): Promise<Prompt[]> {
    const response = await api.get<Prompt[]>('/prompts');
    return response.data;
  },

  async getPromptById(id: number): Promise<Prompt> {
    const response = await api.get<Prompt>(`/prompts/${id}`);
    return response.data;
  },

  async createPrompt(promptText: string, negativePrompt?: string): Promise<Prompt> {
    // Transform frontend format to backend format
    const response = await api.post<Prompt>('/prompts', {
      title: promptText.substring(0, 50) + (promptText.length > 50 ? '...' : ''), // Create title from prompt
      prompt_text: promptText,
      negative_prompt: negativePrompt || '',
    });
    return response.data;
  },

  async updatePrompt(id: number, promptText: string, negativePrompt?: string): Promise<Prompt> {
    // Transform frontend format to backend format
    const response = await api.put<Prompt>(`/prompts/${id}`, {
      title: promptText.substring(0, 50) + (promptText.length > 50 ? '...' : ''),
      prompt_text: promptText,
      negative_prompt: negativePrompt || '',
    });
    return response.data;
  },

  async deletePrompt(id: number): Promise<void> {
    await api.delete(`/prompts/${id}`);
  },
};
