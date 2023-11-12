import { useCallback, useEffect, useRef, useState } from "react"
import { LeftPanel } from "../../components/LeftPanel"
import ProgressBar from "../../components/ProgressBar/ProgressBar"
import SettingCard from "../../components/SettingCard/SettingCard"
import { TopRightPanel } from "../../components/TopRightPanel"
import { UploadIcon } from "../../icons/UploadIcon"
import {
  adjustFragmentLightnessForColor, 
  adjustLightnessForColor, 
  colors, 
  getImageData, 
  getImagePixel, 
  imageDataToDataUrl, 
  rgbColors, 
  rgbToHsl 
} from "../../utils/colors"
import ChooseColorSetting from "../../components/ChooseColorSetting/ChooseColorSetting"
import "./styles.css"


export const Colors = () => {
  const [fileName, setFileName] = useState<string | null>("image.png");
  const [imageSrc, setImageSrc] = useState<string | null>("./image.png");
  const [transformedImageSrc, setTransformedImageSrc] = useState<string | null>(null);
  
  const [lightness, setLightness] = useState(1); // [0.1, 2.0]

  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 });

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showHoverSquare, setShowHoverSquare] = useState(false);

  const [color, setColor] = useState(colors[0]);
  const [tolerance, setTolerance] = useState(100); // [0, 255]

  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [showSelection, setShowSelection] = useState(false);
  
  const originalImage = useRef<HTMLImageElement>(null);

  const hoveredColor = `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`;

  const processImage = useCallback(() => {
    console.log('processImage');
    if (!imageSrc) return;
    const img = originalImage.current!;
    const imgData = getImageData(img);
    if (!imgData) return;
    const newData = adjustLightnessForColor(imgData, rgbColors[color], lightness - 1, tolerance);
    const transformedSrc = imageDataToDataUrl(newData, img.naturalWidth, img.naturalHeight);
    setTransformedImageSrc(transformedSrc);
  }, [color, imageSrc, lightness, tolerance]);

  const clearImageProcessing = useCallback(() => {
    if (!imageSrc) return;
    setTransformedImageSrc(imageSrc);
  }, [imageSrc]);

  const processImageFragment = useCallback(() => {
    if (isSelecting) return;
    if (!originalImage.current || !imageSrc) return;

    clearImageProcessing();

    const img = originalImage.current;
    const imgData = getImageData(img);
    if (!imgData) return;

    const scaleRatio = img.naturalWidth / img.offsetWidth;
  
    const selection = {
      startX: Math.round(Math.min(selectionStart.x, selectionEnd.x) * scaleRatio),
      startY: Math.round(Math.min(selectionStart.y, selectionEnd.y) * scaleRatio),
      endX: Math.round(Math.max(selectionStart.x, selectionEnd.x) * scaleRatio),
      endY: Math.round(Math.max(selectionStart.y, selectionEnd.y) * scaleRatio),
    };
  
    const newData = adjustFragmentLightnessForColor(
      imgData, 
      rgbColors[color], 
      lightness - 1, 
      selection, 
      img.naturalWidth, 
      tolerance
    );
    const transformedSrc = imageDataToDataUrl(newData);
    setTransformedImageSrc(transformedSrc);
  }, [
    clearImageProcessing, 
    color, imageSrc, isSelecting, lightness, tolerance,
    selectionEnd.x, selectionEnd.y, selectionStart.x, selectionStart.y
  ]);

  useEffect(() => {
    if (showSelection) {
      processImageFragment();
      return;
    }
    processImage();
  }, [showSelection, processImage, processImageFragment]);

  useEffect(() => {
    setShowHoverSquare(!showSelection);
  }, [showSelection]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = function(e) {
        const result = String(e.target?.result); 
        setImageSrc(result);
        setTransformedImageSrc(result);
        setShowSelection(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (isSelecting) {
      const { offsetX, offsetY } = event.nativeEvent;
      setSelectionEnd({ x: offsetX, y: offsetY });
      return;
    }

    const img = event.target as HTMLImageElement;
    const { offsetX, offsetY } = event.nativeEvent;
    
    const { data } = getImagePixel(img, offsetX, offsetY)!;

    const [r, g, b] = data;
    setRgbValues({ r, g, b });

    const hsl = rgbToHsl(r, g, b);
    setHslValues({ h: hsl[0], s: hsl[1], l: hsl[2] });
    setCursorPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLImageElement>) => {
    if (showSelection) {
      setShowSelection(false);
      return;
    }
    const { offsetX, offsetY } = event.nativeEvent;
    setShowSelection(true);
    setSelectionStart({ x: offsetX, y: offsetY });
    setSelectionEnd({ x: offsetX, y: offsetY });
    setIsSelecting(true);
  }; 
  
  const handleMouseUp = () => {
    setIsSelecting(false);
    processImageFragment();
    // Add logic to process the selected area if needed
  };

  const getSelectionStyle = () => {
    const width = Math.abs(selectionEnd.x - selectionStart.x);
    const height = Math.abs(selectionEnd.y - selectionStart.y);
    const left = Math.min(selectionEnd.x, selectionStart.x);
    const top = Math.min(selectionEnd.y, selectionStart.y);
  
    return {
      left: `${left}px`, 
      top: `${top}px`, 
      width: `${width}px`, 
      height: `${height}px`, 
      border: showSelection ? '2px dashed blue' : 'none',
      position: 'absolute',
      pointerEvents: 'none'
    } as const;
  };
  

  return (
    <div className="colors">
      <LeftPanel page="page-2" />
      <div className="container">
        <div className="content">
          <div className="top-panel">
            <div className="text-wrapper-2">
              Educational platform - Colors
            </div>
            <TopRightPanel className="top-right-panel" theme="dark" />
          </div>
          <div className="page">
            <div className="preview">
              <div className="text-wrapper-3">
                {fileName ? fileName.slice(0,50) : "No image selected"}
              </div>
              <div className="images-frame">
                <div className="image-container" >
                  <img 
                    src={imageSrc ?? ""} 
                    alt="Original" 
                    ref={originalImage} 
                    onMouseDown={handleMouseDown} 
                    onMouseMove={handleMouseMove} 
                    onMouseEnter={() => setShowHoverSquare(true)}
                    onMouseLeave={() => setShowHoverSquare(false)}
                    onMouseUp={handleMouseUp} 
                    draggable={false}
                  />
                  <div className="selection-rectangle" style={getSelectionStyle()}></div>
                </div>

                {transformedImageSrc && (
                  <div className="image-container" onMouseMove={handleMouseMove} >
                    <img 
                      src={transformedImageSrc} 
                      alt="Transformed" 
                      onMouseEnter={() => setShowHoverSquare(true)}
                      onMouseLeave={() => setShowHoverSquare(false)}
                    />
                    <div className="selection-rectangle" style={getSelectionStyle()}></div>
                  </div>
                )}
              </div>
              <div className="color-models">
                <div className="rgb">
                  <div className="indicator">RGB</div>
                  <div>({rgbValues.r}, {rgbValues.g}, {rgbValues.b})</div>
                </div>
                <div className="hsl">
                  <div className="indicator">HSL</div>
                  <div>({hslValues.h}, {hslValues.s}%, {hslValues.l}%)</div>
                </div>
              </div>
            </div>
            <div className="right-panel">
              <SettingCard color="blue">
                  <input type="file" accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none', color: "royalblue" }} 
                    id="image-upload" 
                  />
                  <label htmlFor="image-upload" className="upload">
                    <UploadIcon />
                    Upload Image
                  </label>
              </SettingCard>
              <SettingCard color="orange">
                <ProgressBar 
                  title="Lightness"
                  steps={20} 
                  max={2.0}
                  toFixed={1}
                  progressState={[lightness, setLightness]} />
              </SettingCard>
              <ChooseColorSetting
                colors={colors}
                setColor={colorIndex => setColor(colors[colorIndex])}
              />
              <SettingCard color="blue">
                <ProgressBar 
                  title="Tolerance"
                  steps={15} 
                  max={255}
                  progressState={[tolerance, setTolerance]} />
              </SettingCard>
            </div>
          </div>
        </div>
      </div>
      {
        showHoverSquare && (
          <div className="hover-square" style={{
            backgroundColor: hoveredColor,
            left: `${cursorPos.x + 10}px`,
            top: `${cursorPos.y + 10}px`
          }}></div>
        )
      }
    </div>
  );
};
