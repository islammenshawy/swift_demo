'use client';

import { Slide } from '@/types/demo';
import TitleSlide from './slides/TitleSlide';
import ContentSlide from './slides/ContentSlide';
import ChartSlide from './slides/ChartSlide';
import SpeakerSlide from './slides/SpeakerSlide';
import TimelineSlide from './slides/TimelineSlide';
import ImageSlide from './slides/ImageSlide';
import InteractiveSlide from './slides/InteractiveSlide';

interface SlideRendererProps {
  slide: Slide;
  navigationKey?: number;
  forcePhase?: number;
  isCapturing?: boolean;
  onPhaseChange?: (phase: number) => void;
}

export default function SlideRenderer({ slide, navigationKey = 0, forcePhase, isCapturing = false, onPhaseChange }: SlideRendererProps) {
  // Use slide.id + navigationKey to force remount on navigation (ensures animations replay)
  const slideKey = `${slide.id}-${navigationKey}`;

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
        return <TitleSlide key={slideKey} content={slide.content} isCapturing={isCapturing} />;
      case 'content':
        return <ContentSlide key={slideKey} content={slide.content} />;
      case 'chart':
        return <ChartSlide key={slideKey} content={slide.content} />;
      case 'speaker':
        return <SpeakerSlide key={slideKey} content={slide.content} />;
      case 'timeline':
        return <TimelineSlide key={slideKey} content={slide.content} />;
      case 'image':
        return <ImageSlide key={slideKey} content={slide.content} />;
      case 'comparison':
        return <ContentSlide key={slideKey} content={slide.content} />;
      case 'interactive':
        return <InteractiveSlide key={slideKey} content={slide.content} slideId={slideKey} forcePhase={forcePhase} isCapturing={isCapturing} onPhaseChange={onPhaseChange} />;
      default:
        return <ContentSlide key={slideKey} content={slide.content} />;
    }
  };

  return (
    <div
      className="w-full h-full relative"
      style={{
        backgroundColor: slide.backgroundColor || 'var(--bg-primary)',
        backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background overlay if there's an image */}
      {slide.backgroundImage && (
        <div className="absolute inset-0 bg-[var(--bg-primary)]/70" />
      )}

      {/* Slide content */}
      <div className="relative z-10 w-full h-full">{renderSlide()}</div>
    </div>
  );
}
