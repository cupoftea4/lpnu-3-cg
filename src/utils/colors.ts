type Optional<T> = T | undefined;

type Selection = { startX: number, startY: number, endX: number, endY: number };

export const colors = [
  "royalblue" as const, 
  "limegreen" as const, 
  "goldenrod" as const, 
  "mediumorchid" as const, 
  "firebrick" as const, 
  "black" as const, 
  "white" as const
];

type Color = typeof colors[number]; 

export const rgbColors: Record<Color, ColorModelValues> = {
  royalblue: [50, 50, 200],
  goldenrod: [200, 200, 50],
  limegreen: [50, 200, 50],
  mediumorchid: [200, 50, 200],
  firebrick: [200, 50, 50],
  white: [200, 200, 200],
  black: [50, 50, 50],
}


export type ColorModelValues = [number, number, number];

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s;

  if(max === min) {
      h = s = 0; // achromatic
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      if (h == undefined) {
        throw new Error("h is undefined");
      }
      h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hueToRgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

export function adjustLightnessForColor(
  imageData: ImageData, 
  targetColor: [number, number, number], 
  lightnessChange: number,
  tolerance: number = 100
): ImageData {
  const data = imageData.data;

  const isPixelColorClose = (r: number, g: number, b: number) => isColorClose(r, g, b, targetColor, tolerance);

  for (let i = 0; i < data.length; i += 4) {
    lightenPixel(data, i, lightnessChange, isPixelColorClose);
  }

  return imageData;
}

export function adjustFragmentLightnessForColor(
  imageData: ImageData, 
  targetColor: [number, number, number], 
  lightnessChange: number, 
  selection: Selection,
  naturalWidth: number,
  tolerance: number = 100
): ImageData {
  const data = imageData.data;
  const { startX, startY, endX, endY } = selection;

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const index = (y * naturalWidth + x) * 4;
      lightenPixel(data, index, lightnessChange, (r, g, b) =>  isColorClose(r, g, b, targetColor, tolerance));
    }
  }

  return imageData;
}

function lightenPixel(
  data: Uint8ClampedArray, 
  index: number, 
  lightnessChange: number,
  isPixelColorClose: ((r: number, g: number, b: number) => boolean)
) {
  let r = data[index];
  let g = data[index + 1];
  let b = data[index + 2];

  if (isPixelColorClose(r, g, b)) {
      const hsl = rgbToHsl(r, g, b);

      const [h, s] = hsl;
      let l = hsl[2];

      // Adjust lightness
      l = Math.min(100, l * (1 + lightnessChange));

      [r, g, b] = hslToRgb(h / 360, s / 100, l / 100);

      // Update the image data
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
  }
}

function isColorClose(r: number, g: number, b: number, targetColor: ColorModelValues, tolerance: number): boolean {
  const [tr, tg, tb] = targetColor;
  return Math.abs(r - tr) <= tolerance && 
         Math.abs(g - tg) <= tolerance && 
         Math.abs(b - tb) <= tolerance;
}

export const getImagePixel = (image: HTMLImageElement, offsetX = 0, offsetY = 0) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);

  return ctx.getImageData(offsetX, offsetY, 1, 1);
}

export const getImageData = (
  image: HTMLImageElement
): Optional<ImageData> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

  try {
    return ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
  } catch (e) {
    console.error("Error extracting image fragment:", e);
  }
}

export function imageDataToDataUrl(imageData: ImageData, width = imageData.width, height = imageData.height): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
