
import React, { useState } from 'react';
import Modal from './Modal';

interface JoinCodeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmJoin: (joinCode: string) => void;
}

const JoinCodeInputModal: React.FC<JoinCodeInputModalProps> = ({
  isOpen,
  onClose,
  onConfirmJoin
}) => {
  const [joinCode, setJoinCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    const trimmedCode = joinCode.trim().toUpperCase();
    if (!trimmedCode) {
      setError('Please enter a join code.');
      return;
    }
    // Basic validation for length, can be more specific if codes have fixed length
    if (trimmedCode.length < 4 || trimmedCode.length > 8) { 
        setError('Join code should be 4-8 characters long.');
        return;
    }
    setError('');
    onConfirmJoin(trimmedCode);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Movie Matcher">
      <div className="space-y-4 py-4">
        <p className="text-slate-300 text-center mb-2">
          Enter the code shared by your friend to join their Movie Matcher session.
        </p>
        <div>
          <label htmlFor="joinCodeInput" className="block text-sm font-medium text-slate-300 mb-1 sr-only">
            Join Code
          </label>
          <input
            type="text"
            id="joinCodeInput"
            value={joinCode}
            onChange={(e) => {
                setJoinCode(e.target.value.toUpperCase());
                if (error) setError('');
            }}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow text-center text-lg tracking-widest"
            placeholder="e.g., ABCDXY"
            maxLength={8}
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-1 text-center">{error}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          Join Session
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

export default JoinCodeInputModal;