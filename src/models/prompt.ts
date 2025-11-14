export interface Prompt {
  id: number;
  user_id: number;
  title: string;
  prompt_text: string;
  negative_prompt?: string;
  style?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PromptInput {
  title: string;
  prompt_text: string;
  negative_prompt?: string;
  style?: string;
}
