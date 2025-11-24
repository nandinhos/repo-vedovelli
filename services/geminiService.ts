import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY not found in environment variables.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateSmartDescription = async (
    title: string,
    content: string,
    type: 'code' | 'file'
): Promise<string> => {
    const client = getClient();
    if (!client) return "Descrição indisponível (Chave API ausente).";

    try {
        const prompt = `
            Você é um assistente técnico para um repositório de desenvolvedores.
            Crie uma descrição breve, técnica e convidativa (máximo de 2 frases) para o seguinte item:
            
            Tipo: ${type === 'code' ? 'Snippet de Código' : 'Arquivo/Documento'}
            Título: ${title}
            Conteúdo/Contexto: ${content.substring(0, 500)}...
            
            Responda apenas com a descrição em Português.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "Não foi possível gerar a descrição.";
    } catch (error) {
        console.error("Erro ao gerar descrição com Gemini:", error);
        return "Erro ao contactar a IA.";
    }
};

export const analyzeCodeQuality = async (code: string): Promise<string> => {
    const client = getClient();
    if (!client) return "";

    try {
         const prompt = `
            Analise brevemente este código. Liste 3 pontos positivos ou sugestões de melhoria em formato de bullet points curtos.
            Código:
            ${code.substring(0, 1000)}
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "";
    } catch (error) {
        return "";
    }
}