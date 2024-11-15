'use client';
import { useEffect, useState } from "react";

interface UseObserverOptions {
    target: React.RefObject<Element>;
    option?: IntersectionObserverInit;
}

export const useObserver = ({ target, option = { threshold: 0.1 } }: UseObserverOptions) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            setIsVisible(entry.isIntersecting);
        };

        const observer = new IntersectionObserver(observerCallback, option);

        if (target.current) {
            observer.observe(target.current);
        }

        return () => {
            if (target.current) {
                observer.unobserve(target.current);
            }
        };
    }, [target, option]);

    return { isVisible };
};
