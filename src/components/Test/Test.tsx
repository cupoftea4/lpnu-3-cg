import React, { useEffect } from 'react';
import './styles.css';
import { Question } from '../../utils/tests';

type OwnProps = {
  test: Question;
  onCorrectAnswer?: () => void;
};

const Test: React.FC<OwnProps> = ({ test, onCorrectAnswer }) => {
  const [clickedCorrectAnswer, setClickedCorrectAnswer] = React.useState<number | null>(null);
  const [clickedWrongAnswer, setClickedWrongAnswer] = React.useState<number | null>(null);
  const [continuedWithWrongAnswer, setContinuedWithWrongAnswer] = React.useState<boolean>(false);

  useEffect(() => {
    setClickedCorrectAnswer(null);
    setClickedWrongAnswer(null);
    setContinuedWithWrongAnswer(false);
  }, [test]);

  const handleAnswerClick = (index: number) => {
    setContinuedWithWrongAnswer(false);
    if (index === test.rightAnswer) {
      setClickedCorrectAnswer(index);
      setClickedWrongAnswer(null);
    } else {
      setClickedWrongAnswer(index);
      setClickedCorrectAnswer(null);
    }
  };

  const handleContinueClick = () => {
    if (clickedCorrectAnswer === test.rightAnswer) {
      onCorrectAnswer?.();
    } else {
      setContinuedWithWrongAnswer(true);
    }
  }

  return (
    <div className='test'>
      <div className={`question ${continuedWithWrongAnswer ? 'wrong' : ''}`}>
        <div className='title'>{test.question}</div>
        {test.illustration && (
          <div className='illustration'>
            <img src={test.illustration} alt='illustration' className='illustration-image' />
          </div>
        )}
        {test.options && (
          <div className='options'>
            {test.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={`option-button ${
                  clickedCorrectAnswer === index ? 'selected' : ''
                } ${
                  clickedWrongAnswer === index ? 'wrong' : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        {test.images && (
          <div className='images'>
            {test.images.map((image, index) => (
              <div className={`clickable-image ${
                  clickedCorrectAnswer === index ? "selected" : ""
                } ${
                  clickedWrongAnswer === index ? "wrong" : ""
                }`} key={index}>
                <img
                  src={image}
                  alt={`option ${index}`}
                  onClick={() => handleAnswerClick(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <button className='test-button' onClick={handleContinueClick}>Continue</button>
    </div>
  );
};

export default Test;
