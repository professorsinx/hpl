"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  /** Stagger, in milliseconds, for items revealed together. */
  delay?: number;
  children: ReactNode;
  id?: string;
};

/**
 * Fades content up the first time it scrolls into view. Server-rendered
 * content is always visible: the hidden starting state is applied here, after
 * hydration, and only to elements still below the fold. Nothing depends on
 * JavaScript to be readable.
 */
export function Reveal({ as: Tag = "div", className, delay = 0, children, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    node.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.remove("reveal-pending");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      node.classList.remove("reveal-pending");
    };
  }, []);

  return (
    <Tag ref={ref} id={id} className={className ? `reveal ${className}` : "reveal"} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
