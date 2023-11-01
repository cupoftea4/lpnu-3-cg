import {
 setUniform, resizeCanvasToDisplaySize, createProgram, createShader
} from "./webgl.js"

let vertexCode: string, fragmentCode: string;

async function init(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
  vertexCode = await (await fetch('./vertex_shader.vert')).text();
  fragmentCode = await (await fetch('./fragment_shader.frag')).text();
  return createCanvas(canvas, gl);
}

function createCanvas(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {

  if (!vertexCode || !fragmentCode) {
    console.warn("Vertex or Fragment code not loaded yet!")
    return null;
  }

  const vertexShader: WebGLShader = createShader(gl, gl.VERTEX_SHADER, vertexCode)!;
  const fragmentShader: WebGLShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode)!;

  let program: WebGLProgram;
  try {
    program = createProgram(gl, vertexShader, fragmentShader)!;
    console.log("Compiled!", program)
  } catch (e) {
    throw "Didn't compile!";
  }

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
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

  render(gl);

  return program;
}

function render(gl: WebGL2RenderingContext) {
  // Draw 2 triangles in the shape of the screen
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);

  window.requestAnimationFrame(() => render(gl));
}

export function setPower(gl: WebGL2RenderingContext, program: WebGLProgram, power: number) {
  setUniform(gl, program, "1i", "power", power);
}

export function setIterations(gl: WebGL2RenderingContext, program: WebGLProgram, iterations: number) {
  setUniform(gl, program, "1i", "iterations", iterations);
}

export function setMousePos(gl: WebGL2RenderingContext, x: number, y: number) {
  const programLocation = gl.getParameter(gl.CURRENT_PROGRAM);
  setUniform(gl, programLocation, "2f", "mousepos", [x, y]);
}

export function setHueShift(gl: WebGL2RenderingContext, program: WebGLProgram, color: number) {
  setUniform(gl, program, "1f", "hueShift", color);
}

export function setVibrance(gl: WebGL2RenderingContext, program: WebGLProgram, color: number) {
  setUniform(gl, program, "1f", "colorVibrance", color);
}

export function setSaturation(gl: WebGL2RenderingContext, program: WebGLProgram, color: number) {
  setUniform(gl, program, "1f", "colorSaturation", color);
}


export default init;
