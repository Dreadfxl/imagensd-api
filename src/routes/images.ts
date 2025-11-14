import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { generateImage, getImages, getImageById } from '../controllers/imageController';

const router = express.Router();

router.post('/generate', authenticateToken, generateImage);
router.get('/', authenticateToken, getImages);
router.get('/:id', authenticateToken, getImageById);

export default router;
