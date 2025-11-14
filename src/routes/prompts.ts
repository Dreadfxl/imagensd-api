import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getPrompts, getPromptById, createPrompt, updatePrompt, deletePrompt } from '../controllers/promptController';

const router = express.Router();

// Todas as rotas de prompt requerem autenticação
router.get('/', authenticateToken, getPrompts);
router.get('/:id', authenticateToken, getPromptById);
router.post('/', authenticateToken, createPrompt);
router.put('/:id', authenticateToken, updatePrompt);
router.delete('/:id', authenticateToken, deletePrompt);

export default router;
