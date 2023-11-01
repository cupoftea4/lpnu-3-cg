import { FC, memo, useEffect, useRef, useState } from 'react'
import init, { setHueShift, setIterations, setMousePos, setPower, setSaturation, setVibrance } from '../../utils/newton-fractal';

type OwnProps = {
  iterations?: number;
  power?: number;
  hueColor?: HueColor;
  saturation?: number;
  vibrance?: number;
  onConstantChange?: (c: { x: number, y: number }) => void;
}

const colorHueCoefficients = {
  yellow: 0.2,
  green: 0.4,
  blue: 0.6,
  purple: 0.9,
  red: 0.0,
  colorful: -1,
} 

export type HueColor = keyof typeof colorHueCoefficients;

function computeC(mousepos: { x: number, y: number }, width: number, height: number): { x: number, y: number } { // m in Webgl
  return {
      x: 0.5 * (mousepos.x - 0.5 * width),
      y: 0.5 * (mousepos.y - 0.5 * height)
  };
}

const _NewtonFractal: FC<OwnProps> = ({ iterations = 50, power = 5, hueColor = "colorful", saturation, vibrance, onConstantChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<WebGL2RenderingContext | null>(null);
  const [program, setProgram] = useState<WebGLProgram | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2")!;

    init(canvas, gl).then(setProgram);
    setGl(gl);

    const onMouseMove = (e: MouseEvent) => {
      const mousePosX = e.clientX - canvas.getBoundingClientRect().x;
      const mousePosY = e.clientY - canvas.getBoundingClientRect().y;
      const c = computeC({ x: mousePosX, y: mousePosY }, canvas.width, canvas.height);
      onConstantChange?.(c);
      setMousePos(gl, mousePosX, e.clientY - mousePosY);
    }
    
    document.addEventListener("mousemove", onMouseMove)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
    }
  }, [onConstantChange]);

  useEffect(() => {
    if (!gl || !program) return;
    setPower(gl, program, power);
  }, [power, gl, program])

  useEffect(() => {
    if (!gl || !program) return;
    setIterations(gl, program, iterations);
  }, [iterations, gl, program])

  useEffect(() => {
    if (!gl || !program) return;
    setHueShift(gl, program, colorHueCoefficients[hueColor]);
  }, [hueColor, gl, program])

  useEffect(() => {
    if (!gl || !program) return;
    setSaturation(gl, program, saturation ?? 1.0);
  }, [gl, program, saturation])

  useEffect(() => {
    if (!gl || !program) return;
    setVibrance(gl, program, vibrance ?? 0.025);
  }, [gl, program, vibrance])
  
  return (
    <canvas id="fractal-canvas" width="1200" height="600" ref={canvasRef} />
  )
}

export const NewtonFractal = memo(_NewtonFractal);
