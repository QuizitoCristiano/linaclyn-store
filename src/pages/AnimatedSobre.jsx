import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export function AnimatedCounter({ value }) {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView) {
            // Se for o "24/7", não animamos, apenas ignoramos a lógica de contagem
            if (value === "24/7") return;

            let cleanValue = value.replace('+', '').replace('%', '').split('/')[0];

            if (cleanValue.includes('.') && !value.includes('/5')) {
                cleanValue = cleanValue.replace(/\./g, '');
            }

            const numericValue = parseFloat(cleanValue);
            if (isNaN(numericValue)) return;

            let start = 0;
            const duration = 2000;
            const framesPerSecond = 60;
            const totalFrames = (duration / 1000) * framesPerSecond;
            const increment = numericValue / totalFrames;

            const timer = setInterval(() => {
                start += increment;
                if (start >= numericValue) {
                    setCount(numericValue);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, 1000 / framesPerSecond);

            return () => clearInterval(timer);
        } else {
            setCount(0);
        }
    }, [inView, value]);

    const formatDisplay = (num) => {
        // CASO ESPECIAL: Suporte 24/7
        if (value === "24/7") return value;

        if (value.includes("/5")) return num.toFixed(1) + "/5";
        if (value.includes("%")) return Math.floor(num) + "%";
        if (value.includes("+")) return Math.floor(num).toLocaleString("pt-BR") + "+";
        return Math.floor(num).toLocaleString("pt-BR");
    };

    return <span ref={ref}>{formatDisplay(count)}</span>;
}