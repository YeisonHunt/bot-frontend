// types
export interface Action {
    id: number;
    title: string;
    duration: number;
    state: 'fulfilled' | 'pending';
}

export interface Bot {
    id: number;
    title: string;
    completedActions: Action[];
}
  
export interface BotsState {
bots: Bot[];
status: 'idle' | 'loading' | 'succeeded' | 'failed';
error: string | null | undefined;
rules: Action[];
}
