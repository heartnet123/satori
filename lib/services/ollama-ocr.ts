import axios from 'axios';

// Ollama client for local GLM-OCR / Vision tasks
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function runOllamaOCR(imageBuffer: Buffer): Promise<string> {
  try {
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: 'glm-ocr', // Assuming glm-ocr model is pulled in Ollama
      prompt: 'Extract all text from the provided resume image.',
      images: [imageBuffer.toString('base64')],
      stream: false,
    });
    
    return response.data.response;
  } catch (error) {
    console.error('Ollama OCR Error:', error);
    throw new Error('Failed to perform OCR via Ollama.');
  }
}
