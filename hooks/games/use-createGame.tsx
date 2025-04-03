type GameFormAction =
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_DESCRIPTION'; payload: string }
    | { type: 'SET_CATEGORY'; payload: number }
    | { type: 'SET_TAGS'; payload: string[] }
    | { type: 'SET_VERSION'; payload: string }
    | { type: 'SET_SIZE_MB'; payload: number }
    | { type: 'SET_CONTENT'; payload: string }
    | { type: 'SET_COVER_IMAGE'; payload: File | null }
    | { type: 'SET_SCREENSHOTS'; payload: File[] }
    | { type: 'ADD_SCREENSHOT'; payload: File }
    | { type: 'REMOVE_SCREENSHOT'; payload: number }
    | { type: 'SET_GAME_LINK'; payload: string }
    | { type: 'RESET_FORM' };

const initialGameFormState: CreateGameDto = {
    title: '',
    excerpt: '',
    categoryId: 0,
    tags: [],
    version: '1.0.0',
    fileSize: 0,
    description: '',
    coverImage: null,
    screenshots: [],
    game_url: '',
    creatorId: 0
};

function gameFormReducer(state: CreateGameDto, action: GameFormAction): CreateGameDto {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...state, title: action.payload };
        case 'SET_DESCRIPTION':
            return { ...state, excerpt: action.payload };
        case 'SET_CATEGORY':
            return { ...state, categoryId: action.payload };
        case 'SET_TAGS':
            return { ...state, tags: action.payload };
        case 'SET_VERSION':
            return { ...state, version: action.payload };
        case 'SET_SIZE_MB':
            return { ...state, fileSize: action.payload };
        case 'SET_CONTENT':
            return { ...state, description: action.payload };
        case 'SET_COVER_IMAGE':
            return { ...state, coverImage: action.payload };
        case 'SET_SCREENSHOTS':
            return { ...state, screenshots: action.payload };
        case 'ADD_SCREENSHOT':
            return { ...state, screenshots: [...state.screenshots, action.payload] };
        case 'REMOVE_SCREENSHOT':
            return {
                ...state,
                screenshots: state.screenshots.filter((_, index) => index !== action.payload)
            };
        case 'SET_GAME_LINK':
            return { ...state, game_url: action.payload };
        case 'RESET_FORM':
            return initialGameFormState;
        default:
            return state;
    }
}

import { CreateGameDto } from '@/data/@types/models/games/dto/create-game.dto';
import { useReducer } from 'react';

function useGameForm() {
    const [state, dispatch] = useReducer(gameFormReducer, initialGameFormState);

    return {
        state,
        setTitle: (title: string) => dispatch({ type: 'SET_TITLE', payload: title }),
        setDescription: (excerpt: string) => dispatch({ type: 'SET_DESCRIPTION', payload: excerpt }),
        setCategory: (category: number) => dispatch({ type: 'SET_CATEGORY', payload: category }),
        setTags: (tags: string[]) => dispatch({ type: 'SET_TAGS', payload: tags }),
        setVersion: (version: string) => dispatch({ type: 'SET_VERSION', payload: version }),
        setSizeMb: (sizeMb: number) => dispatch({ type: 'SET_SIZE_MB', payload: sizeMb }),
        setContent: (content: string) => dispatch({ type: 'SET_CONTENT', payload: content }),
        setCoverImage: (coverImage: File | null) => dispatch({ type: 'SET_COVER_IMAGE', payload: coverImage }),
        setScreenshots: (screenshots: File[]) => dispatch({ type: 'SET_SCREENSHOTS', payload: screenshots }),
        addScreenshot: (screenshot: File) => dispatch({ type: 'ADD_SCREENSHOT', payload: screenshot }),
        removeScreenshot: (index: number) => dispatch({ type: 'REMOVE_SCREENSHOT', payload: index }),
        setGameLink: (gameLink: string) => dispatch({ type: 'SET_GAME_LINK', payload: gameLink }),
        resetForm: () => dispatch({ type: 'RESET_FORM' })
    };
}

export { gameFormReducer, initialGameFormState, useGameForm };
export type { CreateGameDto, GameFormAction };