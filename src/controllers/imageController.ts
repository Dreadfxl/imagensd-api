import axios from 'axios';
import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { GenerationRequest } from '../models/generatedImage';

// Configuração da API externa
const GOOGLE_API_URL = process.env.GOOGLE_IMAGE_API_URL || '';
const SD_API_URL = process.env.SD_API_URL || 'http://localhost:7860';

export const generateImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const isPremium = !!req.userPremium;
    const { prompt, negative_prompt = '', style = '', prompt_id, source = 'local', batch_size } : GenerationRequest = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Free users can gerar só 1 imagem; Premium pode batch (default 4)
    const imagesToGenerate = (isPremium && batch_size) ? Math.max(1, Math.min(batch_size, 4)) : 1;

    // Decide URL e payload
    let apiUrl = '';
    let apiPayload: any = {};

    if (source === 'external') {
      apiUrl = GOOGLE_API_URL;
      apiPayload = { prompt, batch_size: imagesToGenerate };
    } else {
      apiUrl = `${SD_API_URL}/sdapi/v1/txt2img`;
      apiPayload = {
        prompt,
        negative_prompt,
        sampler_name: 'Euler a',
        steps: 30,
        width: 512,
        height: 768,
        cfg_scale: 7,
        batch_size: imagesToGenerate
      };
    }

    // Chamada à API (local ou externa)
    const apiRes = await axios.post(apiUrl, apiPayload, { timeout: 90000 });

    let images: string[] = [];
    if (source === 'external' && apiRes.data.images) {
      images = apiRes.data.images; // espera-se array de URLs
    } else if (apiRes.data.images) {
      images = apiRes.data.images; // WebUI normalmente retorna base64
    }

    // Salva cada imagem na BD
    let resultImages = [];
    for (const img of images) {
      let url = img;
      // Se vier base64 do SD local, opcionalmente podes guardar numa pasta e depois servir por URL
      if (img.length > 200) { // base64 longa
        url = `/uploads/${Date.now()}-${Math.random().toString(36).substring(2,8)}.png`;
        // Aqui faríamos o decode e gravar localmente (por agora só demonstração)
      }
      const dbResult = await pool.query(
        'INSERT INTO generated_images (user_id, prompt_id, image_path, prompt_used, generation_params) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, prompt_id || null, url, prompt, apiPayload]
      );
      resultImages.push(dbResult.rows[0]);
    }
    res.status(201).json(resultImages);
  } catch (error) {
    console.error('Image generation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image(s)' });
  }
};

export const getImages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const result = await pool.query('SELECT * FROM generated_images WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
};

export const getImageById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const imgId = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM generated_images WHERE id = $1 AND user_id = $2', [imgId, userId]);
    if (!result.rows.length) return res.status(404).json({ error: 'Image not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get image by ID error:', error);
    res.status(500).json({ error: 'Failed to get image' });
  }
};
