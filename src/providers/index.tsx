'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import ToastProvider from '@/components/providers/ToastProvider';
import Chatbot from '@/components/Chatbot';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ToastProvider />
            <Chatbot />
        </QueryClientProvider>
    );
}
