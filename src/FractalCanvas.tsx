import { useEffect, useRef } from "react";
import { createProgram, createShader, resizeCanvasToDisplaySize, setUniform } from "./webgl";
  
// let program: WebGLProgram;
let vertexCode: string, fragmentCode: string;
  
// const func = "z^5 + m";
  
  
async function init(canvas: HTMLCanvasElement) {
  vertexCode = await (await fetch('./shader.vert')).text();
  fragmentCode = await (await fetch('./shader.frag')).text();

  createCanvas(canvas);
}
  
function createCanvas(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      alert("WebGL not supported on this browser.");
      throw new Error("WebGL not supported");
    }
  
    if (!vertexCode || !fragmentCode) {
        console.warn("Vertex or Fragment code not loaded yet!")
        return
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode);

    let program: WebGLProgram;
    try {
        program = createProgram(gl, vertexShader!, fragmentShader!);
    } catch (e) {
        throw "Didn't compile!";
    }

    const positionAttributeLocation = gl.getAttribLocation(program!, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    const positions = [
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
  
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    gl.useProgram(program);
    gl.bindVertexArray(vao);
  
    const programLocation = gl.getParameter(gl.CURRENT_PROGRAM);
    setUniform(gl, programLocation, "1f", "width", gl.canvas.width);
    setUniform(gl, programLocation, "1f", "height", gl.canvas.height);
  
    render(canvas);
  }
  
  function render(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2")!;
  
    // Draw 2 triangles in the shape of the screen
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  
    window.requestAnimationFrame(() => render(canvas));
  }
  
/*   let functionBox = document.getElementById("function");
  functionBox.value = func;
  functionBox.addEventListener("change", () => {
    func = functionBox.value;
    clearGL(program);
    try {
      createCanvas();
    } catch (e) {
      console.log(e)
    }
  }) */
  


const FractalCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    init(canvasRef.current!);
    document.addEventListener("mousemove", (e) => {
      // Don't change if modal is open
      // if (modal.style.display == "block") return
    
      // Set mousepos uniform every time user moves mouse
      const gl = canvasRef.current!.getContext("webgl2")!;
      const programLocation = gl.getParameter(gl.CURRENT_PROGRAM);
      if (programLocation) {
        setUniform(gl, programLocation, "2f", "mousepos", [e.clientX, e.clientY]);
      }
    })
  }, []);


  return (
    <>
      <canvas id="fractal-canvas" width="500" height="500" ref={canvasRef} />
    </>
  )
}

export default FractalCanvas;



/* function draw(canvas: HTMLCanvasElement): void {
  const gl: WebGLRenderingContext | null = canvas.getContext("webgl");
  const k = new KochFractal();

  for (let i = 0; i < 7; i++) {
    if (!gl) {
      alert("WebGL not supported on this browser.");
      throw new Error("WebGL not supported");
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertexShaderSource = //glsl `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0, 1);
    }
  `;

  const fragmentShaderSource = `
      void main() {
          gl_FragColor = vec4(1, 1, 1, 1); // White color
      }
  `;

  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vs, fs);
  gl.useProgram(program);

  console.log(k.lines)
  for (const line of k.lines) {
      const vertices = new Float32Array([line.start.x, line.start.y, line.end.x, line.end.y]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.LINES, 0, 2);
  }
      k.nextLevel();
  }

  
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader: WebGLShader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error("Shader compile error");
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}

class Vec2 {
  constructor(public x: number, public y: number) {}

  copy(): Vec2 {
      return new Vec2(this.x, this.y);
  }

  add(v: Vec2): Vec2 {
      return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vec2): Vec2 {
      return new Vec2(this.x - v.x, this.y - v.y);
  }

  mult(s: number): Vec2 {
      return new Vec2(this.x * s, this.y * s);
  }

  div(s: number): Vec2 {
      return new Vec2(this.x / s, this.y / s);
  }

  rotate(theta: number): Vec2 {
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      return new Vec2(this.x * cosT - this.y * sinT, this.x * sinT + this.y * cosT);
  }
}

class KochLine {
  constructor(public start: Vec2, public end: Vec2) {}

  kochA(): Vec2 {
      return this.start.copy();
  }

  kochB(): Vec2 {
      return this.start.add(this.end.sub(this.start).div(3));
  }

  kochC(): Vec2 {
      const direction = this.end.sub(this.start);
      const a = this.start.add(direction.div(3));
      return a.add(a.rotate(-Math.PI * 4 / 5));
  }

  kochD(): Vec2 {
      return this.start.add(this.end.sub(this.start).mult(2 / 3.0));
  }

  kochE(): Vec2 {
      return this.end.copy();
  }
}

class KochFractal {
  lines: KochLine[] = [];
  count: number = 0;

  constructor() {
      this.restart();
  }

  restart(): void {
      this.lines = [];
      this.count = 0;
      this.lines.push(new KochLine(new Vec2(-0.6, 0), new Vec2(0.6, 0)));
  }

  nextLevel(): void {
      const nextLines: KochLine[] = [];

      for (const line of this.lines) {
          nextLines.push(new KochLine(line.kochA(), line.kochB()));
          nextLines.push(new KochLine(line.kochB(), line.kochC()));
          nextLines.push(new KochLine(line.kochC(), line.kochD()));
          nextLines.push(new KochLine(line.kochD(), line.kochE()));
      }

      this.lines = nextLines;
      this.count++;
  }

  getCount(): number {
      return this.count;
  }
} */



/* function renderKochCurve(gl: WebGLRenderingContext, vertices: number[]): void {
  const buffer: WebGLBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Fragment shader remains unchanged, but the vertex shader can stay simple as we're using 2D points:
  const vertexShaderSource = `
      attribute vec2 position;
      void main() {
          gl_Position = vec4(position, 0, 1);
      }
  `;

  const vs: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, `
      void main() {
          gl_FragColor = vec4(0, 1, 0, 1); // Green color
      }
  `);

  const program: WebGLProgram = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
}
 */

/* function calculateColor(x: number, y: number, canvasWidth: number, canvasHeight: number): [number, number, number, number] {
  const r: number = x / canvasWidth;
  const g: number = 1 - (x / canvasWidth);
  const b: number = y / canvasHeight;
  const a: number = 1;

  return [r, g, b, a];
}

function renderSquare(gl: WebGLRenderingContext, color: [number, number, number, number], scale: number): void { // Scale the vertex data
  const vertexData: number[] = [
      -0.8 * scale,  0.8 * scale, // Top-left
      -0.8 * scale, -0.8 * scale, // Bottom-left
      0.8 * scale,  0.8 * scale, // Top-right
      0.8 * scale, -0.8 * scale, // Bottom-right
  ];
  
  const buffer: WebGLBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

  const fragmentShaderSource: string = `
      void main() {
          gl_FragColor = vec4(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});
      }
  `;

  const vertexShader: string = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0, 1);
    }
`;

  const vs: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fs: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)!;
  
  const program: WebGLProgram = gl.createProgram()!;
  gl.attachShader(program, vs); // Assuming vs (vertex shader) is already compiled and available
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
} */

/* function calculateScale(x: number, y: number, canvasWidth: number, canvasHeight: number): number {
  const distanceFromCenter = Math.sqrt(Math.pow(x - canvasWidth / 2, 2) + Math.pow(y - canvasHeight / 2, 2));
  const maxDistance = Math.sqrt(Math.pow(canvasWidth, 2) + Math.pow(canvasHeight, 2)) / 2;
  return (0.2 + 0.8 * (distanceFromCenter / maxDistance)); // Minimum scale of 0.2, Maximum scale of 1.0
} */