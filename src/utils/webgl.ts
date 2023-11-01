function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader); 
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram()!;

  try {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
  } catch (e) {
    throw "Didn't compile!"
  }

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program
  }
  gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  const needResize = canvas.width !== displayWidth ||
    canvas.height !== displayHeight

  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

type UniformType = "1f" | "2f" | "3f" | "1i";

function setUniform(gl: WebGL2RenderingContext, program: WebGLProgram, type: UniformType, name: string, value: number | number[]) {
  const location = gl.getUniformLocation(program, name);

  if (type === "1f" && typeof value === "number") {
    console.log("Setting uniform", name, value)
    gl.uniform1f(location, value);
  } else if (type === "2f" && Array.isArray(value)) {
    gl.uniform2f(location, value[0], value[1]);
  } else if (type === "3f" && Array.isArray(value)) {
    gl.uniform3f(location, value[0], value[1], value[2]);
  } else if (type === "1i" && typeof value === "number") {
    gl.uniform1i(location, value);
  }
}

function clearGL(program: WebGLProgram, canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2")
  gl?.deleteProgram(program)
}

export {
  clearGL, setUniform, resizeCanvasToDisplaySize, createProgram, createShader
}
