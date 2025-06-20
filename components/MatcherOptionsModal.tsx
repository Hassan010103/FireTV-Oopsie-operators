
import React from 'react';
import Modal from './Modal';

interface MatcherOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewMatcher: () => void;
  onJoinWithCode: () => void;
}

const MatcherOptionsModal: React.FC<MatcherOptionsModalProps> = ({
  isOpen,
  onClose,
  onCreateNewMatcher,
  onJoinWithCode
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Movie Matcher Options">
      <div className="space-y-4 py-4">
        <p className="text-slate-300 text-center mb-6">
          How would you like to start your Movie Matcher session?
        </p>
        <button
          onClick={onCreateNewMatcher}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          Create New Matcher Session
        </button>
        <button
          onClick={onJoinWithCode}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          Join Session with Code
        </button>
      </div>
       <div className="mt-6 text-center">
        <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-slate-200"
        >
            Cancel
        </button>
      </div>
    </Modal>
  );
};

export default MatcherOptionsModal;