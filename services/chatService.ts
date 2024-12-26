import { API } from "@/constants/api";
import { ChatResponse } from "@/types/chat";


export const chatService = {
    async fetchMessages(page: number): Promise<ChatResponse> {
        try {
            const response = await fetch(`${API.BASE_URL}${API.CHAT_ENDPOINT}?page=${page}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },
};