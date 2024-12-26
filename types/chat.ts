export interface ChatMessage {
    id: string;
    message: string;
    sender: {
      image: string;
      is_kyc_verified: boolean;
      self: boolean;
      user_id: string;
    };
    time: string;
  }
  
  export interface ChatResponse {
    chats: ChatMessage[];
    from: string;
    to: string;
    name: string;
  }
  
  export interface TripDetails {
    from: string;
    to: string;
    name: string;
  }