import OpenAI from 'openai';

class LeadGenerationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateLeadInsights(relevantDocuments: any[], query: string) {
    const context = relevantDocuments.map(doc => doc.content).join('\n\n');

    const prompt = `
      Context: ${context}
      Query: ${query}

      Using the maritime industry context, generate a detailed lead generation insight:
      1. Identify potential business opportunities
      2. Highlight key companies or sectors
      3. Provide strategic recommendations
      4. Suggest potential sales approaches
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content;
  }
}

export default LeadGenerationService;