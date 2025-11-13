import { Request, Response } from 'express';
import pool from '../config/database';
import { PromptInput } from '../models/prompt';
import { AuthRequest } from '../middleware/auth';

export const getPrompts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const results = await pool.query(
      'SELECT * FROM prompts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(results.rows);
  } catch (error) {
    console.error('Error getting prompts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPromptById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const promptId = parseInt(req.params.id);
    const result = await pool.query(
      'SELECT * FROM prompts WHERE id = $1 AND user_id = $2',
      [promptId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting prompt by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPrompt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { title, prompt_text, negative_prompt = '', style = '' }: PromptInput = req.body;

    if (!title || !prompt_text) {
      return res.status(400).json({ error: 'Title and prompt_text are required' });
    }

    const result = await pool.query(
      'INSERT INTO prompts (user_id, title, prompt_text, negative_prompt, style) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, prompt_text, negative_prompt, style]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePrompt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const promptId = parseInt(req.params.id);
    const { title, prompt_text, negative_prompt = '', style = '' }: PromptInput = req.body;

    const result = await pool.query(
      'UPDATE prompts SET title = $1, prompt_text = $2, negative_prompt = $3, style = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, prompt_text, negative_prompt, style, promptId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found or no permission to update' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePrompt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const promptId = parseInt(req.params.id);
    const result = await pool.query(
      'DELETE FROM prompts WHERE id = $1 AND user_id = $2 RETURNING id',
      [promptId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found or no permission to delete' });
    }
    res.json({ success: true, deleted_id: promptId });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
