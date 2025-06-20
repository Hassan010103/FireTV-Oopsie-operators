
import React from 'react';
import Modal from './Modal'; // Assuming Modal component exists and works
import LoadingSpinner from './LoadingSpinner';

interface AiSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summaryText: string;
  isLoading: boolean;
  errorText: string;
  lastPositionFormatted: string;
  onPlay: () => void;
}

const AiSummaryModal: React.FC<AiSummaryModalProps> = ({
  isOpen,
  onClose,
  title,
  summaryText,
  isLoading,
  errorText,
  lastPositionFormatted,
  onPlay
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-sm text-slate-400 mb-3">
        You previously stopped watching at {lastPositionFormatted}.
      </div>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner />
          <p className="mt-3 text-slate-300">Generating summary...</p>
        </div>
      )}
      {!isLoading && errorText && (
        <div className="my-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300">
          <p className="font-semibold">Error</p>
          <p>{errorText}</p>
        </div>
      )}
      {!isLoading && !errorText && summaryText && (
        <div className="my-4 p-3 bg-slate-700/50 rounded-md max-h-60 overflow-y-auto scrollbar-thin">
          <p className="text-slate-200 whitespace-pre-wrap">{summaryText}</p>
        </div>
      )}
      {!isLoading && !errorText && !summaryText && (
         <div className="my-4 p-3 text-slate-400 text-center">
            No summary available or generated yet.
        </div>
      )}
      <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md text-slate-300 bg-slate-600 hover:bg-slate-500 transition-colors"
        >
          Close
        </button>
        <button
          onClick={onPlay}
          className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          {summaryText && !errorText ? 'Continue Watching' : 'Play (Skip Summary)'}
        </button>
      </div>
    </Modal>
  );
};

export default AiSummaryModal;