export interface FocusTip {
  title: string;
  expansion: string;
  practiceExercise: string;
  reward: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category?: string;
  hint?: string;
}

export interface StarExample {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewStage {
  stageId: string;
  stageName: string;
  description: string;
  questions: InterviewQuestion[];
  recruiterExpectations?: string;
  practicePointers?: string[];
  starExample?: StarExample;
}

export interface InterviewPlan {
  jobTitle: string;
  companyName: string;
  adhdFocusTips: FocusTip[];
  stages: InterviewStage[];
  elevatorPitch?: string;
}
