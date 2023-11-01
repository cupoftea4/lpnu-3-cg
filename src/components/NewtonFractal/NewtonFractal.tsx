import { FC, memo, useEffect, useRef, useState } from 'react'
import init, { setIterations, setMousePos, setPower } from '../../utils/newton-fractal';

type OwnProps = {
  iterations?: number;
  power?: number;
}

const _NewtonFractal: FC<OwnProps> = ({ iterations = 50, power = 5 }) => {
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
      setMousePos(gl, e.clientX, e.clientY);
    }
    
    document.addEventListener("mousemove", onMouseMove)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
    }
  }, []);

  useEffect(() => {
    if (!gl || !program) return;
    setPower(gl, program, power);
  }, [power, gl, program])

  useEffect(() => {
    if (!gl || !program) return;
    setIterations(gl, program, iterations);
  }, [iterations, gl, program])
  
  return (
    <canvas id="fractal-canvas" width="1200" height="600" ref={canvasRef} />
  )
}

export const NewtonFractal = memo(_NewtonFractal);