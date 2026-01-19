export type AnimationStyle = 'particles' | 'globe' | 'dataStreams' | 'minimalist';

export type SlideType =
  | 'title'
  | 'content'
  | 'chart'
  | 'image'
  | 'speaker'
  | 'timeline'
  | 'comparison'
  | 'interactive';

export type VisualizationType =
  | 'message-inbox'
  | 'template-comparison'
  | 'memory-train'
  | 'score-calculation'
  | 'level-weights'
  | 'promotion-pipeline'
  | 'feature-showcase'
  | 'problem-visual'
  | 'solution-visual'
  | 'ai-capabilities'
  | 'hidden-workflow'
  | 'patterns-emerge'
  | 'message-types'
  | 'branch-intelligence'
  | 'team-benchmarking'
  | 'legacy-problems'
  | 'technical-challenges'
  | 'product-opportunities'
  | 'transformation-goals'
  | 'elc-reimagination'
  | 'transformation-metrics'
  | 'trade-architecture'
  | 'module-consolidation'
  | 'elc-architecture'
  | 'elc-integration-patterns'
  | 'engineering-score-journey';

export type ChartType = 'bar' | 'line' | 'pie' | 'donut';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface Speaker {
  name: string;
  title: string;
  company?: string;
  image?: string;
  bio?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface SlideContent {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  text?: string;
  image?: string;
  chartType?: ChartType;
  chartData?: ChartData[];
  speaker?: Speaker;
  timeline?: TimelineItem[];
  comparison?: {
    left: { title: string; items: string[] };
    right: { title: string; items: string[] };
  };
  visualization?: VisualizationType;
}

export interface SlideAnimation {
  entry: 'fadeIn' | 'slideLeft' | 'slideRight' | 'slideUp' | 'scale' | 'blur';
  duration: number;
  delay: number;
  stagger?: number;
}

export interface Slide {
  id: string;
  order: number;
  type: SlideType;
  content: SlideContent;
  animation: SlideAnimation;
  backgroundImage?: string;
  backgroundColor?: string;
  hidden?: boolean;
}

export interface Demo {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  slides: Slide[];
  theme: 'swift-dark' | 'swift-light';
  autoPlaySpeed?: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: number;
  url: string;
  thumbnail?: string;
}

export interface SlideAnalysis {
  slideType: SlideType;
  title: string | null;
  subtitle: string | null;
  content: string[];
  data: ChartData[];
  visualDescription: string;
  suggestedAnimations: {
    entry: string;
    elements: { id: string; animation: string }[];
    emphasis: string[];
  };
  speakerNotes: string;
}
