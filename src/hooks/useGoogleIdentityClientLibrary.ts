import { useState, useEffect, } from 'react';

interface GoogleIdentityClientLibraryProps {
    /**
     * Nonce applied to GSI script tag. Propagates to GSI's inline style tag
     */
    nonce: string;
    onload?: (event: Event) => any;
    onerror?: (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => any;
}

export default function useGoogleIdentityClientLibrary( { nonce }: GoogleIdentityClientLibraryProps): boolean {
    const [scriptLoadedSuccessfully, setScriptLoadedSuccessfully] = useState(false);
    //const [client, setClient] = useState<any>(null);
    //const onScriptLoadSuccessRef = useRef(onScriptLoadSuccess);
    //onScriptLoadSuccessRef.current = onScriptLoadSuccess;

    //const onerrorRef = useRef(onerror);
    //onerrorRef.current = onerror;

    //const [client, setClient] = useState<any>(null);

    useEffect(() => {
        console.log('useEffect load google client library script');
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://accounts.google.com/gsi/client';
        scriptTag.async = true;
        scriptTag.defer = true;
        if (nonce) {
            scriptTag.nonce = nonce;
        }
        scriptTag.onload = (ev: Event) => {
            console.log('useEffect google client library script loaded successfully');
            setScriptLoadedSuccessfully(true);
        };
        scriptTag.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
            console.warn('useEffect google client library script failed to load', event, source, lineno, colno, error);
        };

        document.body.appendChild(scriptTag);

        return () => {
            console.log('useEffect remove google client library script from DOM 🏴‍☠️');
            document.body.removeChild(scriptTag);
        };
    }, [nonce]);
    
    return scriptLoadedSuccessfully;
}