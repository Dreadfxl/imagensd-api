import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { imageService } from '../services/imageService';
import { promptService } from '../services/promptService';
import type { Prompt, GeneratedImage } from '../types';

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
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            ImaGenSD
                        </h1>
                        <p className="text-slate-400 mt-1">AI-Powered Image Generation</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-slate-300">
                                Welcome, <span className="font-semibold">{user?.username}</span>
                            </p>
                            {user?.isPremium && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                    ✨ Premium
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
                {/* Image Generation Section */}
                <div className="space-y-6">
                    {/* Generation Form */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                            <span className="text-primary-400">🎨</span>
                            Generate Image
                        </h2>
                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label htmlFor="promptText" className="block text-sm font-medium text-slate-300 mb-2">
                                    Prompt
                                </label>
                                <textarea
                                    id="promptText"
                                    value={promptText}
                                    onChange={(e) => setPromptText(e.target.value)}
                                    required
                                    rows={4}
                                    placeholder="A beautiful sunset over mountains, vibrant colors, highly detailed..."
                                    className="input-field resize-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="negativePrompt" className="block text-sm font-medium text-slate-300 mb-2">
                                    Negative Prompt <span className="text-slate-500">(Optional)</span>
                                </label>
                                <textarea
                                    id="negativePrompt"
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    rows={2}
                                    placeholder="blurry, low quality, distorted..."
                                    className="input-field resize-none"
                                />
                            </div>

                            {/* Error/Success Messages */}
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300">
                                    <p className="text-sm flex items-center gap-2">
                                        <span>⚠️</span>
                                        {error}
                                    </p>
                                </div>
                            )}
                            {success && (
                                <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-300">
                                    <p className="text-sm flex items-center gap-2">
                                        <span>✅</span>
                                        {success}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        Generate Image
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Generated Images */}
                    {images.length > 0 && (
                        <div className="card p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="text-primary-400">🖼️</span>
                                Generated Images
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-lg border border-slate-700 hover:border-primary-500 transition-all duration-300"
                                    >
                                        <img
                                            src={img}
                                            alt={`Generated ${index + 1}`}
                                            className="w-full h-auto aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Prompts History Section */}
                <div className="card p-6">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <span className="text-primary-400">📜</span>
                        Your Prompts
                    </h2>
                    {prompts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4 opacity-20">🎨</div>
                            <p className="text-slate-400">No prompts yet.</p>
                            <p className="text-slate-500 text-sm mt-1">Generate your first image to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {prompts.map((prompt) => (
                                <div
                                    key={prompt.id}
                                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                                >
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium mb-1">PROMPT</p>
                                            <p className="text-sm text-slate-200 leading-relaxed">{prompt.prompt_text}</p>
                                        </div>
                                        {prompt.negative_prompt && (
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1">NEGATIVE</p>
                                                <p className="text-sm text-slate-400 leading-relaxed">{prompt.negative_prompt}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-800">
                                            <span>🕒</span>
                                            {new Date(prompt.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
