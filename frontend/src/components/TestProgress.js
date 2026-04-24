import React from 'react';

const STEPS = [
  'Global',
  'Episodic Memory',
  'Executive',
  'Language',
  'Functional'
];

const TestProgress = ({ currentStep }) => {
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="tp-progress-container">
      <div className="tp-progress-track">
        <div 
          className="tp-progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="tp-progress-steps">
        {STEPS.map((step, index) => {
          let status = '';
          if (index === currentStep) status = 'active';
          else if (index < currentStep) status = 'completed';

          return (
            <div 
              key={step} 
              className={`tp-progress-step ${status}`}
              data-index={index + 1}
            >
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestProgress;
