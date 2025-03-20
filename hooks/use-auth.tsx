"use client"

import { AuthContext, AuthContextType } from '@/shared/authContext';
import { useContext } from 'react';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro do AuthProvider');
    }
    return context;
};
