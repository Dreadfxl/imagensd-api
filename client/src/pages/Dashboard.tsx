import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { imageService } from '../services/imageService';
import { promptService } from '../services/promptService';
import type { Prompt } from '../types';

export default function Dashboard() {
  const [promptText, setPromptText] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const data = await promptService.getPrompts();
      setPrompts(data);
    } catch (err) {
      console.error('Failed to load prompts', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setImages([]);

    try {
      // Save prompt first
      await promptService.createPrompt(promptText, negativePrompt);
      
      // Generate images
      const response = await imageService.generateImage({
        promptText,
        negativePrompt,
      });
      
      setImages(response.images.map((img: GeneratedImage) => `http://localhost:3000${img.url}`));
      setSuccess(response.message);
      loadPrompts(); // Reload prompts list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>ImaGenSD Dashboard</h1>
        <div>
          <span>Welcome, {user?.username}! </span>
          {user?.isPremium && <span style={{ color: '#ffd700' }}>(Premium)</span>}
          <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Image Generation Form */}
        <div>
          <h2>Generate Image</h2>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label htmlFor="promptText">Prompt:</label>
              <textarea
                id="promptText"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                required
                rows={4}
                placeholder="A beautiful sunset over mountains..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="negativePrompt">Negative Prompt (Optional):</label>
              <textarea
                id="negativePrompt"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                rows={2}
                placeholder="blurry, low quality..."
              />
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          {/* Generated Images */}
          {images.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Generated Images:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Generated ${index + 1}`}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prompts History */}
        <div>
          <h2>Your Prompts</h2>
          {prompts.length === 0 ? (
            <p>No prompts yet. Generate your first image!</p>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  style={{
                    background: '#1a1a1a',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                  }}
                >
                  <p><strong>Prompt:</strong> {prompt.promptText}</p>
                  {prompt.negativePrompt && (
                    <p><strong>Negative:</strong> {prompt.negativePrompt}</p>
                  )}
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(prompt.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
