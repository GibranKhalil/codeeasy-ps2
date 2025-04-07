import { useReducer } from 'react';

// Interface para o estado dos filtros
interface FilterState {
    searchQuery: string;
    languageFilter: string;
    engineFilter: string;
}

// Estado inicial dos filtros
const initialFilterState: FilterState = {
    searchQuery: "",
    languageFilter: "",
    engineFilter: ""
};

// Enum para tipos de ações
enum ActionType {
    SET_SEARCH_QUERY = 'set_search_query',
    SET_LANGUAGE_FILTER = 'set_language_filter',
    SET_ENGINE_FILTER = 'set_engine_filter',
    RESET_FILTERS = 'reset_filters'
}

// Tipos de ações
type FilterAction =
    | { type: ActionType.SET_SEARCH_QUERY; payload: string }
    | { type: ActionType.SET_LANGUAGE_FILTER; payload: string }
    | { type: ActionType.SET_ENGINE_FILTER; payload: string }
    | { type: ActionType.RESET_FILTERS };

// Função reducer
const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
    switch (action.type) {
        case ActionType.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload };
        case ActionType.SET_LANGUAGE_FILTER:
            return { ...state, languageFilter: action.payload };
        case ActionType.SET_ENGINE_FILTER:
            return { ...state, engineFilter: action.payload };
        case ActionType.RESET_FILTERS:
            return initialFilterState;
        default:
            return state;
    }
};

// Interface para o retorno do hook
interface UseFiltersReturn extends FilterState {
    setSearchQuery: (query: string) => void;
    setLanguageFilter: (language: string) => void;
    setEngineFilter: (engine: string) => void;
    resetFilters: () => void;
}

// Hook personalizado para usar os filtros
export const useFilters = (): UseFiltersReturn => {
    const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);

    const setSearchQuery = (query: string): void => {
        dispatch({ type: ActionType.SET_SEARCH_QUERY, payload: query });
    };

    const setLanguageFilter = (language: string): void => {
        dispatch({ type: ActionType.SET_LANGUAGE_FILTER, payload: language });
    };

    const setEngineFilter = (engine: string): void => {
        dispatch({ type: ActionType.SET_ENGINE_FILTER, payload: engine });
    };

    const resetFilters = (): void => {
        dispatch({ type: ActionType.RESET_FILTERS });
    };

    return {
        ...filterState,
        setSearchQuery,
        setLanguageFilter,
        setEngineFilter,
        resetFilters
    };
};