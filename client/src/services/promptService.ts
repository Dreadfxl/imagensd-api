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
    const response = await api.post<Prompt>('/prompts', {
      promptText,
      negativePrompt,
    });
    return response.data;
  },

  async updatePrompt(id: number, promptText: string, negativePrompt?: string): Promise<Prompt> {
    const response = await api.put<Prompt>(`/prompts/${id}`, {
      promptText,
      negativePrompt,
    });
    return response.data;
  },

  async deletePrompt(id: number): Promise<void> {
    await api.delete(`/prompts/${id}`);
  },
};
