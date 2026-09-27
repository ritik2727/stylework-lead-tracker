import React from 'react';
import {
  Users,
  LayoutGrid,
  List,
  Plus,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  activeView: 'table' | 'kanban';
  onViewChange: (view: 'table' | 'kanban') => void;
  onOpenCreateModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onViewChange,
  onOpenCreateModal,
  theme,
  onToggleTheme,
  backendOnline,
}) => {
  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Brand / Logo */}
        <div className="navbar__brand">
          <div className="navbar__logo-icon">
            <Users size={22} color="#ffffff" />
          </div>
          <div className="navbar__brand-text">
            <div className="navbar__title-wrap">
              <span className="navbar__title">STYLEWORK</span>
              <span className="navbar__badge">
                <Sparkles size={11} /> CRM
              </span>
            </div>
            <span className="navbar__subtitle">Lead Tracker & Sales Pipeline</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="navbar__views">
          <button
            type="button"
            className={`navbar__view-btn ${activeView === 'table' ? 'navbar__view-btn--active' : ''}`}
            onClick={() => onViewChange('table')}
            title="List / Table View"
          >
            <List size={16} />
            <span>Table View</span>
          </button>
          <button
            type="button"
            className={`navbar__view-btn ${activeView === 'kanban' ? 'navbar__view-btn--active' : ''}`}
            onClick={() => onViewChange('kanban')}
            title="Pipeline / Kanban View"
          >
            <LayoutGrid size={16} />
            <span>Pipeline Board</span>
          </button>
        </div>

        {/* Actions & Utilities */}
        <div className="navbar__actions">
          {/* Live Status indicator */}
          <div
            className={`navbar__status-indicator ${
              backendOnline
                ? 'navbar__status-indicator--online'
                : 'navbar__status-indicator--offline'
            }`}
            title={backendOnline ? 'API Connected & Healthy' : 'Connecting to API...'}
          >
            <span className="pulse-indicator" />
            <span className="navbar__status-label">
              {backendOnline ? 'Live API' : 'Connecting'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="navbar__icon-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Create Lead Primary Button */}
          <button
            type="button"
            className="navbar__cta-btn"
            onClick={onOpenCreateModal}
            id="create-lead-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Lead</span>
          </button>
        </div>
      </div>
    </header>
  );
};
