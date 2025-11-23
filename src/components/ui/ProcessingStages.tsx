import React, { useState, useEffect } from 'react';

interface ProcessingStage {
  id: number;
  text: string;
  duration: number;
}

interface ProcessingStagesProps {
  isComplete?: boolean;
  onCollapse?: () => void;
}

const ProcessingStages: React.FC<ProcessingStagesProps> = ({ 
  isComplete = false,
  onCollapse 
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const stages: ProcessingStage[] = [
    { id: 0, text: "Processing your notes...", duration: 1800 },
    { id: 1, text: "Extracting key points...", duration: 2000 },
    { id: 2, text: "Generating summary...", duration: 2600 },
    { id: 3, text: "Preparing MCQs...", duration: 3500 },
    { id: 4, text: "Finalizing results...", duration: 4000 }
  ];

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      setCompletedStages([0, 1, 2, 3, 4]);
      setShowComplete(true);
      
      // Auto-collapse after 5 seconds
      setTimeout(() => {
        setIsCollapsed(true);
        if (onCollapse) {
          setTimeout(() => {
            onCollapse();
          }, 300);
        }
      }, 5000);
    }
  }, [isComplete, onCollapse]);

  useEffect(() => {
    if (isComplete) return;

    let progressInterval: NodeJS.Timeout;
    let stageTimeout: NodeJS.Timeout;

    const startProgress = () => {
      const currentStageDuration = stages[currentStage].duration;
      const incrementAmount = 100 / (currentStageDuration / 50);

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + incrementAmount;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 50);

      stageTimeout = setTimeout(() => {
        setCompletedStages(prev => [...prev, currentStage]);
        
        if (currentStage < stages.length - 1) {
          setCurrentStage((prev) => prev + 1);
          setProgress(0);
        } else {
          setProgress(100);
        }
      }, currentStageDuration);
    };

    startProgress();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageTimeout);
    };
  }, [currentStage, isComplete]);

  // Calculate progress, cap at 99% until truly complete
  const calculateProgress = () => {
    if (isComplete) {
      return 100;
    }
    const rawProgress = (currentStage * 20) + (progress * 0.20);
    // Cap progress at 99% until backend is complete
    return Math.min(rawProgress, 99);
  };

  const overallProgress = calculateProgress();

  // Return null when collapsed - this removes the component from DOM
  if (isCollapsed) {
    return null;
  }

  return (
    <div 
      className={`w-[70vw] max-w-2xl mx-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border border-blue-200 rounded-lg p-5 shadow-md transition-all duration-500 relative ${
        showComplete ? 'animate-pulse' : ''
      }`}
    >
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              showComplete 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Percentage display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!showComplete ? (
              <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <p className={`text-sm font-semibold ${showComplete ? 'text-green-600' : 'text-blue-700'}`}>
              {Math.round(overallProgress)}% {showComplete && 'Complete'}
            </p>
          </div>
        </div>

        {/* Stage texts - appearing one by one */}
        {!showComplete && (
          <div className="space-y-2 text-sm">
            {stages.map((stage, index) => {
              const isCompleted = completedStages.includes(index);
              const isCurrent = index === currentStage;
              const isVisible = index <= currentStage;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 flex-shrink-0" />
                  )}
                  <p className={`${
                    isCompleted
                      ? 'text-gray-500 line-through'
                      : isCurrent
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-400'
                  }`}>
                    {stage.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Message shown on completion */}
        {showComplete && (
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-semibold">100% Complete</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStages;