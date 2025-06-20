
import React, { useState, useEffect } from 'react';
import { Content, VibeCircle } from '../types';
import Modal from './Modal';

interface CreateSnapModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentToSnap: Content | null;
  currentUserVibeCircles: VibeCircle[];
  onConfirm: (vibeCircleId: string) => void; // Caption removed
}

const CreateSnapModal: React.FC<CreateSnapModalProps> = ({
  isOpen,
  onClose,
  contentToSnap,
  currentUserVibeCircles,
  onConfirm
}) => {
  const [selectedVibeCircleId, setSelectedVibeCircleId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [shareTarget, setShareTarget] = useState<'everyone' | 'vibeCircle'>('vibeCircle');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (currentUserVibeCircles.length > 0) {
        setShareTarget('vibeCircle');
        setSelectedVibeCircleId(currentUserVibeCircles[0].id);
      } else {
        setShareTarget('everyone'); 
        setSelectedVibeCircleId(''); 
      }
    }
  }, [isOpen, currentUserVibeCircles]);

  if (!isOpen || !contentToSnap) return null;

  const handleSubmit = () => {
    let finalVibeCircleId = selectedVibeCircleId;

    if (shareTarget === 'everyone') {
      if (currentUserVibeCircles.length > 0) {
        finalVibeCircleId = currentUserVibeCircles[0].id; 
      } else {
        setError('Cannot share to "Everyone" as you have no Vibe Circles. Please create or join one.');
        return;
      }
    } else { 
      if (!selectedVibeCircleId) {
        setError('Please select a Vibe Circle to post to.');
        return;
      }
    }
    
    setError('');
    onConfirm(finalVibeCircleId); // Caption removed
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share Snap: ${contentToSnap.title.substring(0,25)}${contentToSnap.title.length > 25 ? '...' : ''}`}>
      <div className="space-y-3 py-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800 pr-1">
        {/* Constrained Image Preview Area */}
        <div className="w-full max-w-xs mx-auto aspect-video bg-black rounded-md overflow-hidden shadow-md border border-slate-700 max-h-40 sm:max-h-48 mb-3">
          <img 
            src={contentToSnap.thumbnailUrl} 
            alt={`Scene from ${contentToSnap.title}`}
            className="w-full h-full object-contain" 
          />
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-slate-100 mb-2">Share this 10-second snap to:</label>
          <div className="flex flex-col space-y-2 mb-3">
            <label className="flex items-center space-x-2 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-md cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="shareTarget" 
                value="everyone" 
                checked={shareTarget === 'everyone'}
                onChange={() => setShareTarget('everyone')}
                className="form-radio h-4 w-4 text-purple-500 bg-slate-600 border-slate-500 focus:ring-purple-500 focus:ring-offset-slate-700"
              />
              <span className="text-slate-200 text-sm">Everyone (posts to your first Vibe Circle as a mock)</span>
            </label>
            <label className={`flex items-center space-x-2 p-2 bg-slate-700/50 rounded-md transition-colors ${currentUserVibeCircles.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600/50 cursor-pointer'}`}>
              <input 
                type="radio" 
                name="shareTarget" 
                value="vibeCircle" 
                checked={shareTarget === 'vibeCircle'}
                onChange={() => setShareTarget('vibeCircle')}
                className="form-radio h-4 w-4 text-purple-500 bg-slate-600 border-slate-500 focus:ring-purple-500 focus:ring-offset-slate-700"
                disabled={currentUserVibeCircles.length === 0}
              />
              <span className="text-slate-200 text-sm">Select Vibe Circle</span>
            </label>
          </div>

          {shareTarget === 'vibeCircle' && currentUserVibeCircles.length > 0 && (
            <div>
              <label htmlFor="vibeCircleSelect" className="block text-sm font-medium text-slate-300 mb-1 sr-only">
                Select Vibe Circle:
              </label>
              <select
                id="vibeCircleSelect"
                value={selectedVibeCircleId}
                onChange={(e) => setSelectedVibeCircleId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
              >
                {currentUserVibeCircles.map(vc => (
                    <option key={vc.id} value={vc.id}>{vc.name}</option>
                ))}
              </select>
            </div>
          )}
           {shareTarget === 'vibeCircle' && currentUserVibeCircles.length === 0 && (
             <p className="text-xs text-slate-400">You are not part of any Vibe Circles to select from.</p>
           )}
        </div>

        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 border-t border-slate-700">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md text-slate-300 bg-slate-600 hover:bg-slate-500 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={(shareTarget === 'vibeCircle' && !selectedVibeCircleId && currentUserVibeCircles.length > 0) || (shareTarget === 'everyone' && currentUserVibeCircles.length === 0) }
          className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Post Snap
        </button>
      </div>
    </Modal>
  );
};

export default CreateSnapModal;
