import { GoogleGenAI } from "@google/genai";
import { CharacterType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateClothingAdvice = async (
    weather: string,
    temperature: number,
    targetCharacter: CharacterType
): Promise<string> => {
    try {
        const characterName = targetCharacter === CharacterType.BUNNY ? "小兔子" : "小狗";
        const prompt = `
        现在天气是${weather}，气温是${temperature}度。
        请用温暖、体贴的语气，给你的伴侣（${characterName}）一条简短的穿衣建议。
        不要太长，一句话即可。包含可爱的语气词。
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "天气多变，记得照顾好自己哦！";
    } catch (error) {
        console.error("Gemini advice error:", error);
        return "不管天气如何，都要记得带上好心情！";
    }
};

export const generateLoveQuote = async (): Promise<string> => {
    try {
        const prompt = `
        生成一句关于异地恋、思念、坚持或未来的温暖短句。
        风格要是治愈、浪漫的。不要太长，20个字以内。
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "所爱隔山海，山海皆可平。";
    } catch (error) {
        console.error("Gemini quote error:", error);
        return "距离让心靠得更近。";
    }
};

export const generateMoodComfort = async (mood: string, partnerName: string): Promise<string> => {
    try {
        if (!mood) return "";
        
        const prompt = `
        我的伴侣今天的心情/烦恼是：“${mood}”。
        请以${partnerName}的身份，写一句简短的安慰或鼓励的话。
        语气要非常宠溺和温暖。50字以内。
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "抱抱你，一切都会好起来的！";
    } catch (error) {
        return "我在你身边，别怕。";
    }
};

export const generateRomanticTask = async (): Promise<string> => {
    try {
        const prompt = `
        为异地恋情侣生成一个有趣、浪漫且容易执行的每日小任务。
        例如：“拍一张天空的照片发给对方”、“分享一首今天听的歌”。
        只返回任务内容，不要前缀。15个字以内。
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "给对方分享一件今天发生的小趣事";
    } catch (error) {
        return "给对方打个视频电话吧";
    }
};