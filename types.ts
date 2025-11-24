export enum CharacterType {
    BUNNY = 'BUNNY',
    PUPPY = 'PUPPY'
}

export interface UserState {
    character: CharacterType;
    name: string;
    avatar?: string; // Base64 string of the uploaded image
    location: string;
    weather: string;
    temperature: number;
    timezoneOffset: number; // e.g., 8 for UTC+8
    mood: string;
    dailyPlan: string;
    clothingNote: string; // Manual clothing advice from partner
    lastUpdated: number;
}

export interface MeetingPlan {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    completed: boolean;
}

export interface Task {
    id: string;
    title: string;
    type: 'DAILY' | 'WEEKLY';
    points: number;
    completed: boolean;
    assignedTo: CharacterType | 'BOTH';
}

export interface Capsule {
    id: string;
    sender: CharacterType;
    content: string; // Text content
    type: 'TEXT' | 'PHOTO_NOTE' | 'VOICE_NOTE'; // Simulated types
    createDate: number;
    openDate: string; // YYYY-MM-DD
    isLocked: boolean;
}

export interface AppData {
    nextMeetingDate: string; // YYYY-MM-DD
    meetingPlans: MeetingPlan[];
    bunnyState: UserState;
    puppyState: UserState;
    tasks: Task[];
    capsules: Capsule[];
    totalPoints: number;
    lastTaskResetDate: string; // YYYY-MM-DD
}

export interface GeminiAdvice {
    clothingAdvice: string;
    loveQuote: string;
}