import { CreateTutorialDto } from '@/data/@types/models/tutorials/dto/create-tutorial.dto';
import { useReducer } from 'react';

export type TutorialFormAction =
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_EXCERPT'; payload: string }
    | { type: 'SET_CATEGORY'; payload: number }
    | { type: 'SET_TAGS'; payload: string[] }
    | { type: 'SET_READ_TIME'; payload: number }
    | { type: 'SET_CONTENT'; payload: string }
    | { type: 'SET_COVER_IMAGE'; payload: File | null }
    | { type: 'RESET_FORM' }
    | { type: 'SET_FORM'; payload: CreateTutorialDto };


export const initialTutorialFormState: CreateTutorialDto = {
    categoryId: 0,
    content: '',
    coverImage: null,
    creatorId: 0,
    excerpt: '',
    readTime: 10,
    tags: [],
    title: ""
};

export function tutorialFormReducer(state: CreateTutorialDto, action: TutorialFormAction): CreateTutorialDto {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...state, title: action.payload };
        case 'SET_EXCERPT':
            return { ...state, excerpt: action.payload };
        case 'SET_CATEGORY':
            return { ...state, categoryId: action.payload };
        case 'SET_TAGS':
            return { ...state, tags: action.payload };
        case 'SET_READ_TIME':
            return { ...state, readTime: action.payload };
        case 'SET_CONTENT':
            return { ...state, content: action.payload };
        case 'SET_COVER_IMAGE':
            return { ...state, coverImage: action.payload };
        case 'SET_FORM':
            return { ...state, ...action.payload };
        case 'RESET_FORM':
            return initialTutorialFormState;
        default:
            return state;
    }
}

export function useTutorialForm() {
    const [state, dispatch] = useReducer(tutorialFormReducer, initialTutorialFormState);

    return {
        state,
        setTitle: (title: string) => dispatch({ type: 'SET_TITLE', payload: title }),
        setExcerpt: (excerpt: string) => dispatch({ type: 'SET_EXCERPT', payload: excerpt }),
        setCategory: (category: number) => dispatch({ type: 'SET_CATEGORY', payload: category }),
        setTags: (tags: string[]) => dispatch({ type: 'SET_TAGS', payload: tags }),
        setReadTime: (readTime: number) => dispatch({ type: 'SET_READ_TIME', payload: readTime }),
        setContent: (content: string) => dispatch({ type: 'SET_CONTENT', payload: content }),
        setCoverImage: (coverImage: File | null) => dispatch({ type: 'SET_COVER_IMAGE', payload: coverImage }),
        resetForm: () => dispatch({ type: 'RESET_FORM' }),
        setForm: (form: CreateTutorialDto) => dispatch({ type: 'SET_FORM', payload: form })
    };
}
