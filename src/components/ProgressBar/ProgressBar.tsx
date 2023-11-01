import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  title: string;
  steps?: number;
  max?: number;
  toFixed?: number;
  progressState: [number, React.Dispatch<React.SetStateAction<number>>];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progressState, title, steps = 10, max = steps, toFixed = 0 }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  
  const stepSize = max / (steps);
  const [progress, setProgress] = progressState;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragging && barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const movedPosition = e.clientX - rect.left;
      const stepProgress = (movedPosition / rect.width) * max;
      const closestStep = Math.round(stepProgress / stepSize) * stepSize;
  
      // Ensure progress is within 0-max
      const clampedProgress = Math.max(0, Math.min(max, closestStep));
      setProgress(clampedProgress);
    }
  }, [dragging, max, setProgress, stepSize]);
  

  useEffect(() => {
    const handleMouseUp = () => {
      setDragging(false);
    };
    
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
      const clickedProgress = (clickedPosition / rect.width) * max;
      const closestStep = Math.round(clickedProgress / stepSize) * stepSize;

      const clampedProgress = Math.max(0, Math.min(max, closestStep));
      setProgress(clampedProgress);
    }
  };

  return (
    <div>
      <p>{title}</p>
      <div className={styles.container}>
        <div className={styles.percentage}>{progress.toFixed(toFixed)}</div>
        <div className={styles["progress-bar"]}>
          <div ref={barRef} onClick={handleProgressClick} className={styles.bar}/>
          <div style={{ width: `${progress/max*100}%` }} className={styles.fill}></div>
          <div
            style={{ left: `${progress/max*100}%` }}
            className={styles.circle}
            onMouseDown={() => setDragging(true)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
