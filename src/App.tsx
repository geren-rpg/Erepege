import React, { useEffect } from 'react';
import { CharacterProvider } from './contexts/CharacterContext';
import Header from './components/Header';
import CharacterList from './components/CharacterList';
import CreateCharacter from './components/CreateCharacter';
import CharacterActions from './components/Actions/CharacterActions';
import EditCharacter from './components/EditCharacter';
import History from './components/History';
import './styles/animations.css';

function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Ctrl+Z or Cmd+Z (undo)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('undo-button')?.click();
      }
      
      // Detect Ctrl+Y or Cmd+Shift+Z (redo)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        document.getElementById('redo-button')?.click();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <CharacterProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        
        <main className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Character List - Sidebar */}
            <div className="lg:col-span-4">
              <CharacterList />
              
              <div className="mt-6 lg:block" id="create-character-section">
                <CreateCharacter />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <CharacterActions />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditCharacter />
                <History />
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-gray-900 text-gray-400 text-center py-4 text-sm">
          <p>© 2025 RPG Character Manager</p>
        </footer>
        
        {/* Hidden buttons for keyboard shortcuts */}
        <button id="undo-button" className="hidden" />
        <button id="redo-button" className="hidden" />
      </div>
    </CharacterProvider>
  );
}

export default App;