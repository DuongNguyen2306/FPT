import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const FPT_COLORS = ["#0066b3", "#2563eb", "#f97316", "#10b981", "#ffffff"];

/**
 * Bắn pháo hoa giấy một lần khi mount (trang đăng ký thành công).
 */
export default function useConfettiCelebration(enabled = true) {
  const fired = useRef(false);

  useEffect(() => {
    if (!enabled || fired.current) return;
    fired.current = true;

    const burst = () => {
      confetti({
        particleCount: 80,
        spread: 72,
        startVelocity: 42,
        origin: { y: 0.55, x: 0.5 },
        colors: FPT_COLORS,
        ticks: 200,
        gravity: 1.1,
        scalar: 1.05,
        zIndex: 9999,
      });
    };

    const sides = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: FPT_COLORS,
        zIndex: 9999,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: FPT_COLORS,
        zIndex: 9999,
      });
    };

    burst();
    sides();

    const end = Date.now() + 2200;
    const interval = setInterval(() => {
      sides();
      if (Date.now() > end) clearInterval(interval);
    }, 280);

    return () => clearInterval(interval);
  }, [enabled]);
}
