// ScrollReveal.jsx - Ajustado para ser invisível ao layout
import { useInView } from "react-intersection-observer";

export function ScrollReveal({ children }) {
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${inView ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"
                }`}
        >
            {children}
        </div>
    );
}