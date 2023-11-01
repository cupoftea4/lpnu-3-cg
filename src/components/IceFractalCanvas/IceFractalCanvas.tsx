import { FC, memo, useEffect, useRef } from "react";
import { start } from "../../utils/ice-fractal";
import styles from "./FractalCanvas.module.css";

type OwnProps = {
  iterations: number;
  lengthModifier?: number;
  angleModifier?: number;
}

const _FractalCanvas: FC<OwnProps> = ({ iterations, lengthModifier = 0.8, angleModifier = 0.5 }) => {
  console.log("CHANGED: ", iterations, lengthModifier, angleModifier)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "black";
  
    const iters = iterations > 10 ? 5 : iterations; // Safety check
    start(ctx, iters, lengthModifier, angleModifier);

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    let scale = 1;
    let throttleTimeout: number | null = null;

    const zoom = (e: WheelEvent) => {
      if (!canvas || throttleTimeout) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Depending on the sign of deltaY, zoom in or out
      if (e.deltaY < 0) {
          scale *= 1.2;
      } else if (e.deltaY > 0) {
          scale /= 1.4;
      }

      if (scale < 1) {
          scale = 1;
      } else if (scale > 12) {
          scale = 12;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(x * (1 - scale), y * (1 - scale));
      ctx.scale(scale, scale);
      start(ctx, iterations);
      ctx.restore();

      throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
      }, 300);  // 300ms throttle time
    }

    canvas?.addEventListener('wheel', zoom, { passive: true });

    return () => {
      ctx.clearRect(0, 0, width, height);
      canvas?.removeEventListener('wheel', zoom);
    }
  }, [angleModifier, iterations, lengthModifier]);


  return (
    <>
      <canvas id="fractal-canvas" className={styles.canvas} width="600" height="600" ref={canvasRef} />
    </>
  )
}

export const IceFractalCanvas = memo(_FractalCanvas);