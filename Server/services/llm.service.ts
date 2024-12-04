import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface LLMConfig {
  temperature?: number;
  max_tokens?: number;
}

interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface LLMRequest {
  prompt: string | LLMMessage[];
  system_prompt?: string;
  model?: string;
  config?: LLMConfig;
}

class LLMService {
  private apiBaseUrl: string;
  private teamTag: string;
  private applicationName: string;

  constructor() {
    this.apiBaseUrl = 'https://api.private.test.zeronorth.app/llm-service/v1/complete';
    this.teamTag = process.env.TEAM_TAG || '';
    this.applicationName = process.env.APPLICATION_NAME || '';
  }

  async complete(request: LLMRequest): Promise<any> {
    try {
      const response = await axios.post(this.apiBaseUrl, request, {
        headers: {
          'Authorization': `Bearer ${process.env.JWT_TOKEN}`,
          'X-Team-Tag': this.teamTag,
          'X-Application-Name': this.applicationName,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('LLM API Error:', error);
      throw error;
    }
  }

  // Method for simple text completion
  async generateText(prompt: string, systemPrompt?: string, model: string = 'openai/gpt-4o'): Promise<string> {
    const request: LLMRequest = {
      prompt,
      system_prompt: systemPrompt,
      model,
      config: {
        temperature: 0.2,
        max_tokens: 640
      }
    };

    const result = await this.complete(request);
    return result.choices[0].message.content;
  }

  // Method for conversational AI
  async chat(messages: LLMMessage[], model: string = 'openai/gpt-4o'): Promise<string> {
    const request: LLMRequest = {
      prompt: messages,
      model,
      config: {
        temperature: 0.2,
        max_tokens: 640
      }
    };

    const result = await this.complete(request);
    return result.choices[0].message.content;
  }
}

export default LLMService;