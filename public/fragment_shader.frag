#version 300 es

precision highp float;

out vec4 outColor;

uniform float width;
uniform float height;
uniform int power;
uniform int iterations;

uniform float hueShift;
uniform float colorSaturation;
uniform float colorVibrance;

bool error;

#define complex vec2

uniform complex mousepos;

const complex c_nan = complex(10000.0, 20000.0);
const float PI = 3.1415926535897932384626433832795;

bool diverges(complex z) {
  return z.x >= 10000.0 || z.y >= 10000.0;
}

float c_arg(complex z) {
  if (z == complex(0, 0)) {
    error = true;
  }
  return atan(z.y, z.x);
}

#define c_abs(a) length(a)

complex c_pow(complex z, complex w) {
  float r = c_abs(z);
  float theta = c_arg(z);

  float r_ = pow(r, w.x);
  float theta_ = theta * w.x;

  if (w.y != 0.0) {
    r_ *= exp(-w.y*theta); // e^x
    theta_ += w.y*log(r);
  }

  return complex(r_*cos(theta_), r_*sin(theta_));
}

complex c_sub(complex x, complex y) {
  return complex(x.x-y.x, x.y-y.y);
}

complex c_add(complex x, complex y) {
  return complex(x.x+y.x, x.y+y.y);
}

complex c_mul(complex x, complex y) {
  return complex(x.x * y.x - x.y * y.y, x.y *y.x + x.x * y.y);
}

complex c_div(complex x, complex y) {
  float den = y.x * y.x + y.y * y.y;
  if (den == 0.0) {
    // Can't divide by 0
    error = true;
    return c_nan;
  }
  return complex((x.x*y.x+x.y*y.y)/den, (x.y*y.x-x.x*y.y)/den);
}

complex c_sin(complex z) {
  return complex(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));
}

complex c_cos(complex z) {
  return complex(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));
}

complex c_scale(complex z, float x) {
  return complex(z.x * x, z.y * x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); // fract = (x) =>  x - floor(x)
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); // clamp =  (x) => min(max(x, minVal), maxVal), 
}

vec4 getColor(float h, float s, float v) {
  return vec4(hsv2rgb(vec3(h, s, v)), 1);
}

vec4 newtonsMethod(complex c) {
  // x(n+1) = x(n) - f(n)/f'(n)
  // x(n) = c
  complex z = c;
  int steps = 50;

  int power1 = 4;
  if (power != 0 && power < 8) {
    power1 = power;
  }

  // complex m = 0.005 * (complex(1, 1) - 0.5 * complex(width, height));
  complex m = 0.5 * (mousepos - 0.5 * complex(width, height));


  int iterations1 = 50;
  if (iterations != 0 && iterations < 1000) {
    iterations1 = iterations;
  }


  for (int i = 0; i < iterations; i++) {
    complex f = c_add(c_pow(z,complex(power1, 0.0)),m); // z^power + m
    complex fp = c_add(c_mul(complex(power1, 0.0),c_pow(z,complex(power1 - 1, 0.0))),complex(0, 0.0));

    complex f_over_fprime = c_div(f, fp);
    complex z1 = c_sub(z, f_over_fprime);

    if (distance(z, z1) < 0.001) {
      steps = i;
      break;
    }

    if (error || diverges(z)) {
      return getColor(0.0, 0.0, 0.0);
    }

    z = z1;
  }

  // yellow 0.2
  // green 0.4
  // blue 0.6
  // purple 0.9
  // red 0.0

  // Make color based on z
  float hue = abs(c_arg(z)/2.0/PI); // a_tan(x)
  if (hueShift >= 0.0) {
    hue = abs(c_arg(z)/10.0/PI - hueShift);
  }

  // 0.1 - 2.0

  float satur = 1.0;

  if (colorSaturation > 0.0) {
    satur = colorSaturation;
  }

  float saturation = satur /sqrt(c_abs(z));

  if (c_abs(z) < 0.1) {
    saturation = 0.0;
  }

  // 0.01 - 0.1

  float vibr = 0.025;

  if (colorVibrance > 0.0) {
    vibr = colorVibrance;
  }

  float vibrance = max(1.0 - float(steps)*vibr, 0.0);

  if (c_abs(z) > 100.0) {
    vibrance = 0.0;
  }

  return getColor(hue, saturation, vibrance);
}

void main() {
  vec2 pos = gl_FragCoord.xy;

  float normalizedX = (pos.x - width/2.0) / height;
  float normalizedY = (pos.y - height/2.0) / height;

  outColor = newtonsMethod(c_scale(complex(normalizedX, normalizedY), 4.0));
}
