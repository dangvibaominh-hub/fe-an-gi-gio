"use client";

import {
  Children,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";

import "./Stepper.css";

interface RenderStepIndicatorOptions {
  currentStep: number;
  onStepClick: (step: number) => void;
  step: number;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  backButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  children: ReactNode;
  contentClassName?: string;
  currentStep?: number;
  currentStepDirection?: number;
  disableStepIndicators?: boolean;
  footerClassName?: string;
  initialStep?: number;
  nextButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonText?: string;
  onFinalStepCompleted?: () => void;
  onStepChange?: (step: number) => void;
  renderStepIndicator?: (options: RenderStepIndicatorOptions) => ReactNode;
  showContent?: boolean;
  showFooter?: boolean;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
}

export default function Stepper({
  children,
  currentStep: controlledStep,
  currentStepDirection,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  showContent = true,
  showFooter = true,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const visibleStep = controlledStep ?? currentStep;
  const visibleDirection = currentStepDirection ?? direction;
  const isCompleted = visibleStep > totalSteps;
  const isLastStep = visibleStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);

    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (visibleStep > 1) {
      setDirection(-1);
      updateStep(visibleStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div className="outer-container" {...rest}>
      <div className={`step-circle-container ${stepCircleContainerClassName}`}>
        <div className={`step-indicator-row ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;

            return (
              <Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep: visibleStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > visibleStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={visibleStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > visibleStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep ? (
                  <StepConnector isComplete={visibleStep > stepNumber} />
                ) : null}
              </Fragment>
            );
          })}
        </div>

        {showContent ? (
          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={visibleStep}
            direction={visibleDirection}
            className={`step-content-default ${contentClassName}`}
          >
            {stepsArray[visibleStep - 1]}
          </StepContentWrapper>
        ) : null}

        {showFooter && !isCompleted ? (
          <div className={`footer-container ${footerClassName}`}>
            <div className={`footer-nav ${visibleStep !== 1 ? "spread" : "end"}`}>
              {visibleStep !== 1 ? (
                <button
                  onClick={handleBack}
                  className={`back-button ${visibleStep === 1 ? "inactive" : ""}`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              ) : null}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="next-button"
                {...nextButtonProps}
              >
                {isLastStep ? "Complete" : nextButtonText}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Fragment({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

interface StepContentWrapperProps {
  children: ReactNode;
  className: string;
  currentStep: number;
  direction: number;
  isCompleted: boolean;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted ? (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(height) => setParentHeight(height)}
          >
            {children}
          </SlideTransition>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

export function Step({ children }: { children: ReactNode }) {
  return <div className="step-default">{children}</div>;
}

interface StepIndicatorProps {
  currentStep: number;
  disableStepIndicators: boolean;
  onClickStep: (step: number) => void;
  step: number;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
        ? "inactive"
        : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="step-indicator"
      style={
        disableStepIndicators ? { pointerEvents: "none", opacity: 0.9 } : {}
      }
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: {
            scale: 1,
            backgroundColor: "rgba(226, 114, 91, 0.12)",
            color: "#2b2420",
          },
          active: {
            scale: 1,
            backgroundColor: "#e2725b",
            color: "#ffffff",
          },
          complete: {
            scale: 1,
            backgroundColor: "#e2725b",
            color: "#ffffff",
          },
        }}
        transition={{ duration: 0.3 }}
        className="step-indicator-inner"
      >
        {status === "complete" ? (
          <CheckIcon className="check-icon" />
        ) : status === "active" ? (
          <div className="active-dot" />
        ) : (
          <span className="step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: "#e2725b" },
  };

  return (
    <div className="step-connector">
      <motion.div
        className="step-connector-inner"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
