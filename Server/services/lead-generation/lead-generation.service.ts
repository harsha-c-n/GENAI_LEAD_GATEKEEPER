// import LLMService from '../llm.service';
// import LeadGenerationWorkflow from '../workflow/lead-generation-workflow.service';

// class LeadGenerationService {
//   private llmService: LLMService;

//   constructor() {
//     this.llmService = new LLMService();
//   }

//   async generateLeadInsights(documents: any[], query: string): Promise<any> {
//     // Prepare context for LLM
//     const docContext = documents.map(doc => doc.text);
//     const context =JSON.stringify(docContext)

//     // Create a prompt that includes context and query
//     const prompt = `
//       Context: ${context}
      
//       Query: ${query}
      
//       Based on the given context and query, generate detailed lead insights. 
//       Provide:
//       1. Potential business opportunities
//       2. Key companies or contacts
//       3. Relevant maritime market insights
//     `;

//     // Generate insights using LLM
//     // const insights = await this.llmService.generateText(
//     //   prompt, 
//     //   'You are a maritime market intelligence analyst.',
//     //   'openai/gpt-4o'
//     // );


//     return {
//       rawInsights: insights,
//       processedInsights: this.processInsights(insights)
//     };
//   }

//   private processInsights(insights: string): any {
//     // Implement your insight processing logic here
//     // This could involve parsing the text, extracting key information, etc.
//     return {
//       // Example processing
//       opportunities: insights.split('\n').filter(line => line.startsWith('- Opportunity:'))
//     };
//   }
// }

// export default LeadGenerationService;

import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });
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
      2. list potential companies which are ready to adopt our product based on their revenue, marketcap, profit
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