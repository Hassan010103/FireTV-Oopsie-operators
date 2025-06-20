
import React, { useState, useEffect } from 'react';
import { Content, WatchPartyParticipant } from '../types';
import Modal from './Modal';

interface SuggestToFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentToSuggest: Content | null;
  friends: WatchPartyParticipant[];
  onConfirmSuggestion: (friend: WatchPartyParticipant, message: string) => void;
}

const SuggestToFriendModal: React.FC<SuggestToFriendModalProps> = ({
  isOpen,
  onClose,
  contentToSuggest,
  friends,
  onConfirmSuggestion
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Reset state when modal is opened/closed or content changes
    if (isOpen) {
      setSelectedFriendId(null);
      setMessage('');
    }
  }, [isOpen, contentToSuggest]);

  if (!isOpen || !contentToSuggest) {
    return null;
  }

  const handleConfirm = () => {
    const selectedFriend = friends.find(f => f.userId === selectedFriendId);
    if (selectedFriend) {
      onConfirmSuggestion(selectedFriend, message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Suggest "${contentToSuggest.title}" to a friend`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Select a friend:
          </label>
          {friends.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-slate-700/50 rounded-md scrollbar-thin">
              {friends.map(friend => (
                <button
                  key={friend.userId}
                  onClick={() => setSelectedFriendId(friend.userId)}
                  className={`w-full flex items-center p-2 rounded-md text-left transition-colors
                                ${selectedFriendId === friend.userId 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-slate-600 hover:bg-slate-500 text-slate-200'
                                }`}
                >
                  <img 
                    src={friend.avatarUrl || `https://picsum.photos/seed/${friend.userId}/40/40`} 
                    alt={friend.displayName}
                    className="w-8 h-8 rounded-full mr-3 object-cover"
                  />
                  <span>{friend.displayName}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm p-2 bg-slate-700/50 rounded-md">You have no friends available to suggest to in this mock list.</p>
          )}
        </div>

        <div>
          <label htmlFor="suggestionMessage" className="block text-sm font-medium text-slate-300 mb-1">
            Optional message:
          </label>
          <textarea
            id="suggestionMessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none scrollbar-thin"
            placeholder={`e.g., "You'll love this ${contentToSuggest.genre[0]} movie!"`}
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-slate-300 bg-slate-600 hover:bg-slate-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedFriendId}
            className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Suggestion
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SuggestToFriendModal;