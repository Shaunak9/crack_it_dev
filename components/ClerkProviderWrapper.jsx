"use client"
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function ClerkProviderWrapper({ children }) {
    const { resolvedTheme } = useTheme();
    
    return (
        <ClerkProvider 
            appearance={{ 
                baseTheme: resolvedTheme === 'dark' ? dark : undefined 
            }}
        >
            {children}
        </ClerkProvider>
    )
}
