import { useEffect, useRef, RefObject } from 'react';

export function useIframeResizeObserver(containerRef: RefObject<HTMLDivElement>) {
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                console.log('ResizeObserver fired:', entry);
            }
        });

        const observeTargetElements = () => {
            if (containerRef.current) {
                const iframe = containerRef.current.querySelector('iframe');
                if (iframe && iframe.contentDocument) {
                    const iframeDocument = iframe.contentDocument;
                    const primaryButtons = iframeDocument.querySelectorAll('button[variant="primary"]');
                    const tables = iframeDocument.querySelectorAll('table');

                    primaryButtons.forEach(button => resizeObserver.observe(button));
                    tables.forEach(table => resizeObserver.observe(table));
                }
            }
        };

        observeTargetElements();

        const mutationObserver = new MutationObserver((mutations) => {
            let shouldReobserve = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    shouldReobserve = true;
                }
            });

            if (shouldReobserve) {
                resizeObserver.disconnect();
                observeTargetElements();
            }
        });

        if (containerRef.current) {
            const iframe = containerRef.current.querySelector('iframe');
            if (iframe && iframe.contentDocument) {
                mutationObserver.observe(iframe.contentDocument.body, { childList: true, subtree: true });
            }
        }

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [containerRef]);
}