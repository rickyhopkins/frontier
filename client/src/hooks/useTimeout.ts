import { useEffect, useRef, useState } from "react";

interface UseTimeoutHandler {
    start: () => any;
    stop: () => any;
    isActive: boolean;
}

export const useTimeout = (
    callback: () => void,
    timeoutDelayMs = 0
): UseTimeoutHandler => {
    const [isActive, setIsActive] = useState(false);
    const callbackRef = useRef<() => any>();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const stop = () => {
        setIsActive(false);
    };

    const start = () => {
        setIsActive(true);
    };

    useEffect(() => {
        if (isActive) {
            const callbackAndStop = () => {
                callbackRef.current && callbackRef.current();
                stop();
            };
            const timeout = window.setTimeout(callbackAndStop, timeoutDelayMs);
            return () => {
                window.clearTimeout(timeout);
            };
        }
    }, [isActive, timeoutDelayMs]);

    return { isActive, start, stop };
};
