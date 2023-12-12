import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  title: string;
  steps?: number;
  max?: number;
  min?: number;
  toFixed?: number;
  progressState: [number, React.Dispatch<React.SetStateAction<number>> | ((newVal: number) => void)];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progressState, title, steps = 10, max = steps, toFixed = 0, min = 0 }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  
  const stepSize = (max - min) / steps;
  const [progress, setProgress] = progressState;

  const calculateProgress = useCallback((position: number, rectWidth: number) => {
    const progressValue = ((position / rectWidth) * (max - min)) + min;
    const closestStep = Math.round(progressValue / stepSize) * stepSize;
    return Math.max(min, Math.min(max, closestStep));
  }, [max, min, stepSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging && barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const movedPosition = e.clientX - rect.left;
      setProgress(calculateProgress(movedPosition, rect.width));
    }
  }, [calculateProgress, dragging, setProgress]);
  
  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (barRef.current && !dragging) {
      const rect = barRef.current.getBoundingClientRect();
      const clickedPosition = e.clientX - rect.left;
      setProgress(calculateProgress(clickedPosition, rect.width));
    }
  };

  // Adjust the calculation of width and left style to account for the min value
  const fillWidth = ((progress - min) / (max - min)) * 100;
  const circleLeft = fillWidth;

  return (
    <div>
      <p>{title}</p>
      <div className={styles.container}>
        <div className={styles.percentage}>{progress.toFixed(toFixed)}</div>
        <div className={styles["progress-bar"]}>
          <div ref={barRef} onClick={handleProgressClick} className={styles.bar}/>
          <div style={{ width: `${fillWidth}%` }} className={styles.fill}></div>
          <div
            style={{ left: `${circleLeft}%` }}
            className={styles.circle}
            onMouseDown={() => setDragging(true)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
