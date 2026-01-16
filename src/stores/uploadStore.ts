import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Demo, UploadedFile } from '@/types/demo';

type ProcessingStatus =
  | 'idle'
  | 'uploading'
  | 'converting'
  | 'analyzing'
  | 'generating'
  | 'complete'
  | 'error';

interface UploadState {
  files: UploadedFile[];
  processingStatus: ProcessingStatus;
  progress: number;
  currentStep: string;
  generatedDemo: Demo | null;
  error: string | null;

  addFiles: (files: UploadedFile[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setStatus: (status: ProcessingStatus, step?: string) => void;
  setProgress: (progress: number) => void;
  setGeneratedDemo: (demo: Demo) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>()(
  devtools(
    (set) => ({
      files: [],
      processingStatus: 'idle',
      progress: 0,
      currentStep: '',
      generatedDemo: null,
      error: null,

      addFiles: (files) =>
        set((state) => ({ files: [...state.files, ...files] })),

      removeFile: (id) =>
        set((state) => ({ files: state.files.filter((f) => f.id !== id) })),

      clearFiles: () => set({ files: [] }),

      setStatus: (status, step) =>
        set({
          processingStatus: status,
          currentStep: step || '',
          error: status === 'error' ? undefined : null,
        }),

      setProgress: (progress) => set({ progress }),

      setGeneratedDemo: (demo) =>
        set({ generatedDemo: demo, processingStatus: 'complete' }),

      setError: (error) => set({ error, processingStatus: 'error' }),

      reset: () =>
        set({
          files: [],
          processingStatus: 'idle',
          progress: 0,
          currentStep: '',
          generatedDemo: null,
          error: null,
        }),
    }),
    { name: 'upload-store' }
  )
);
