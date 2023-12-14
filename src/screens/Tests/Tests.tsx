import { useState } from 'react';
import { LeftPanel } from '../../components/LeftPanel';
import Test from '../../components/Test/Test';
import { TopRightPanel } from '../../components/TopRightPanel';
import { tests } from '../../utils/tests';
import './styles.css';
import { useAchievements } from '../../context/AchievementsContext';

const Tests = () => {
  const [currentTest, setCurrentTest] = useState<number>(0);
  const [allTestsCompleted, setAllTestsCompleted] = useState<boolean>(false);

  const { notifyAction } = useAchievements();

  // Function to handle when a correct answer is given
  const handleCorrectAnswer = () => {
    if (currentTest === tests.length - 1) {
      setCurrentTest(tests.length - 1)
      setAllTestsCompleted(true);
      notifyAction('all-tests');
      return;
    }
    setCurrentTest(currentTest + 1);
  };

  // Function to calculate progress for each block
  const calculateBlockProgress = () => {
    const blockInfo = tests.reduce((acc, test, index) => {
      const blockNumber = test.block;
      if (!acc[blockNumber]) {
        acc[blockNumber] = { total: 0, completed: 0 };
      }
      acc[blockNumber].total++;
      if (index < currentTest) {
        acc[blockNumber].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);
  
    return Object.entries(blockInfo).map(([block, info]) => ({
      block: block,
      size: (info.total / tests.length) * 100,
      completed: (info.completed / info.total) * 100
    }));
  };
  
  const blockSizes = calculateBlockProgress();

  return (
    <div className="transform">
      <LeftPanel page="page-4" />
      <div className="container">
        <div className="content">
          <div className="top-panel">
            <div className="text-wrapper-2">
              Educational platform - Tests
            </div>
            <TopRightPanel className="top-right-panel" theme="dark" />
          </div>
          <div className="page">
            <div className="preview">
              <div className="text-wrapper-3">
                Check what you have learned!
              </div>
              <div className='test-container'>
                <div className='test-count'>{currentTest + 1}/{tests.length}</div>
                <div className='tests-progress'>
                  {blockSizes.map((blockSize, index) => (
                    <div key={index} className="progress-block" style={{ width: `${blockSize.size}%` }}>
                      <div className="progress-bar" style={{ width: `${!allTestsCompleted ? blockSize.completed : 100}%` }} />
                    </div>
                  ))}
                </div>
                <div className='test-wrapper'>
                  <Test test={tests[currentTest]} onCorrectAnswer={handleCorrectAnswer} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests;
