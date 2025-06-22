import React, { useRef, useEffect, useState } from 'react';
import { AppView, UserProfile, Content, Platform } from '../types'; // Added Content & Platform

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currentUserProfile: UserProfile | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  searchQuery: string;
  onSearchInputChange: (query: string) => void;
  onSearchSubmit: () => void;
  onClearSearch: () => void;
}

// Icons
const HomeIcon: React.FC<{ className?: string; isCurrent?: boolean }> = ({ className = "h-5 w-5", isCurrent }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${isCurrent ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-300'}`}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string; isCurrent?: boolean }> = ({ className = "h-5 w-5", isCurrent }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${isCurrent ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-300'}`}>
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.071-.655A.78.78 0 0018.01 15c0-.212.009-.432.025-.654a6.483 6.483 0 00-1.905-3.96 3 3 0 014.308 3.516.78.78 0 01-.358.442zM13.5 8a2 2 0 11-4 0 2 2 0 014 0zM10 18a6 6 0 00-4.446-5.746C8.076 11.635 11.924 11.635 14.446 12.254A6 6 0 0010 18z" />
  </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
  </svg>
);

const DocumentTextIcon: React.FC<{ className?: string; isCurrent?: boolean }> = ({ className = "h-5 w-5", isCurrent }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${isCurrent ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-300'}`}>
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string; isCurrent?: boolean }> = ({ className = "h-5 w-5", isCurrent }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${isCurrent ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-300'}`}>
    <path fillRule="evenodd" d="M10 3.75a.75.75 0 01.75.75v4.75h4.75a.75.75 0 010 1.5H10.75v4.75a.75.75 0 01-1.5 0V10.75H4.5a.75.75 0 010-1.5h4.75V4.5A.75.75 0 0110 3.75z" clipRule="evenodd" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string; isCurrent?: boolean }> = ({ className = "h-5 w-5", isCurrent }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${isCurrent ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-300'}`}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.322.805 4.728 4.237-2.23.002.001 4.237 2.23.805-4.728-3.423-3.322-4.752-.39-1.831-4.401zM14.5 10a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" clipRule="evenodd" />
  </svg>
);

const MagnifyingGlassIcon: React.FC<{ className?: string; isCurrent?: boolean }> = ({ className = "h-5 w-5", isCurrent }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${className} ${isCurrent ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-300'}`}>
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

const ArrowLeftOnRectangleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 3.5A1.5 1.5 0 014.5 2h6.5A1.5 1.5 0 0112.5 3.5v2a.5.5 0 01-1 0v-2A.5.5 0 0011 3H4.5a.5.5 0 00-.5.5v13a.5.5 0 00.5.5H11a.5.5 0 00.5-.5v-2a.5.5 0 011 0v2A1.5 1.5 0 0111.5 18h-7A1.5 1.5 0 013 16.5v-13z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.94 9.28a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 01-1.06-1.06L11.31 10l-1.94-1.94a.75.75 0 111.06-1.06l2.5 2.5z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.75 10a.75.75 0 01.75-.75H18a.75.75 0 010 1.5h-4.5A.75.75 0 0112.75 10z" clipRule="evenodd" />
  </svg>
);

const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.75 3.25a.75.75 0 000-1.5H10a.75.75 0 000 1.5h6.75z" />
    <path fillRule="evenodd" d="M6.53 7.47a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 1.06L8.122 7H16.75a.75.75 0 010 1.5H8.122l1.968 1.968a.75.75 0 11-1.06 1.06l-2.5-2.5zM4.5 17a.5.5 0 00.5.5H10a.5.5 0 00.5-.5v-2a.5.5 0 011 0v2A1.5 1.5 0 0110.5 19h-5A1.5 1.5 0 014 17.5v-13A1.5 1.5 0 015.5 3H10a1.5 1.5 0 011.5 1.5v2a.5.5 0 01-1 0v-2a.5.5 0 00-.5-.5h-5a.5.5 0 00-.5.5v13z" clipRule="evenodd" />
  </svg>
);

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  currentUserProfile,
  isAuthenticated,
  onLogout,
  searchQuery,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  const navItems: { label: string; view: AppView, icon: (isCurrent: boolean) => React.ReactNode, authRequired: boolean }[] = [
    { label: 'Home', view: 'home', icon: (isCurrent) => <HomeIcon isCurrent={isCurrent}/>, authRequired: true },
    { label: 'Suggestions', view: 'suggestions', icon: (isCurrent) => <DocumentTextIcon isCurrent={isCurrent}/>, authRequired: true },
    { label: 'Connect', view: 'discoverUsers', icon: (isCurrent) => <MagnifyingGlassIcon className={isCurrent ? 'h-5 w-5 text-purple-400' : 'h-5 w-5 text-slate-500 group-hover:text-purple-300'} isCurrent={isCurrent}/>, authRequired: true },
    { label: 'Watch Party', view: 'watchParty', icon: (isCurrent) => <UsersIcon isCurrent={isCurrent}/>, authRequired: true },
    { label: 'Momentz', view: 'momentz', icon: (isCurrent) => <SparklesIcon isCurrent={isCurrent}/>, authRequired: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.authRequired || isAuthenticated);

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        onSearchInputChange(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [onSearchInputChange]);

  const handleVoiceSearch = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <nav className="bg-slate-800/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo and Nav Links */}
          <div className="flex items-center space-x-8">
            <span 
              className="font-bold text-3xl text-purple-400 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => onNavigate(isAuthenticated ? 'home' : 'login')}
              aria-label="FirePulse Home"
            >
              Fire<span className="text-sky-400">Pulse</span>
            </span>
            <div className="hidden md:flex items-center space-x-2">
              {visibleNavItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`relative flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800
                    ${currentView === item.view 
                      ? 'text-white' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
                    }`}
                  aria-current={currentView === item.view ? 'page' : undefined}
                >
                   <span className={`mr-2 transition-colors`}>
                    {item.icon(currentView === item.view)}
                  </span>
                  <span className={`${currentView === item.view ? 'font-semibold' : ''}`}>{item.label}</span>
                   {currentView === item.view && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-purple-500 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right side: Search, Profile/Login/Logout */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Bar */}
            {isAuthenticated && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" isCurrent={false} />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => onSearchInputChange(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="block w-full md:w-48 lg:w-64 pl-9 pr-14 py-2 border border-slate-700 bg-slate-700/80 text-slate-200 placeholder-slate-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
                  placeholder="Search movies..."
                  autoComplete="off"
                  aria-label="Search movies"
                />
                {searchQuery && (
                  <button
                    onClick={onClearSearch}
                    type="button"
                    className="absolute inset-y-0 right-10 flex items-center px-2 text-slate-400 hover:text-red-400 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
                {/* Mic button at extreme right inside input */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  aria-label="Voice Search"
                  className={`absolute inset-y-0 right-2 flex items-center px-2 rounded-full z-10 ${isListening ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                  style={{height: '100%'}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v1.5m0 0a3.75 3.75 0 01-3.75-3.75h7.5A3.75 3.75 0 0112 20.25zm0-1.5V4.5a3.75 3.75 0 017.5 0v6a3.75 3.75 0 01-7.5 0v-6a3.75 3.75 0 017.5 0v6a3.75 3.75 0 01-7.5 0" />
                  </svg>
                </button>
              </div>
            )}

            {/* Profile/Login/Logout */}
            <div className="flex items-center">
              {isAuthenticated && currentUserProfile ? (
                <>
                  <button 
                    onClick={() => onNavigate('profile')}
                    className="flex items-center p-1 rounded-full text-slate-400 hover:text-slate-100 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 group"
                    aria-label={`View profile for ${currentUserProfile.displayName}`}
                  >
                    {currentUserProfile.avatarUrl ? (
                      <img src={currentUserProfile.avatarUrl} alt={currentUserProfile.displayName} className="h-9 w-9 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 transition-colors"/>
                    ) : (
                      <UserCircleIcon className="h-9 w-9" />
                    )}
                    <span className="ml-2 text-sm font-medium hidden lg:block">{currentUserProfile.displayName}</span>
                  </button>
                  <button
                      onClick={onLogout}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-colors duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ml-1"
                      title="Logout"
                  >
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 text-slate-500 group-hover:text-red-400 transition-colors" />
                      <span className="ml-1.5 hidden sm:block">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 bg-purple-600 hover:bg-purple-500 transition-colors duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  aria-label="Login"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-white" />
                  <span className="ml-1.5 hidden sm:block text-white">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Nav Items */}
      {isAuthenticated && (
        <div className="md:hidden border-t border-slate-700/50">
            <div className="container mx-auto px-2 py-2 flex justify-around items-center">
            {visibleNavItems.map((item) => (
                <button
                key={`${item.view}-mobile`}
                onClick={() => onNavigate(item.view)}
                className={`flex flex-col items-center px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 group focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500
                    ${currentView === item.view 
                    ? 'text-purple-400' 
                    : 'text-slate-400 hover:text-slate-100'
                    }`}
                aria-current={currentView === item.view ? 'page' : undefined}
                >
                <span className={`transition-colors`}>
                    {item.icon(currentView === item.view)}
                </span>
                <span>{item.label}</span>
                </button>
            ))}
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
