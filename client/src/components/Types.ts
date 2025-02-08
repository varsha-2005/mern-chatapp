export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; 
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
}

export interface ChatMessage {
    chatRoomId: string;
    senderId: string;
    content: string;
}

export interface chatContextType{
    messages:Message[];
    setMessages:React.Dispatch<React.SetStateAction<Message[]>>;
    children:React.ReactNode;
}
