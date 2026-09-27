import React from 'react';
import { Users, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import type { LeadStats } from '../types';
import './StatsCards.css';

interface StatsCardsProps {
  stats: LeadStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stats-card skeleton" style={{ height: '110px' }} />
        ))}
      </div>
    );
  }

  const activePipelineCount =
    (stats.byStatus.NEW || 0) +
    (stats.byStatus.CONTACTED || 0) +
    (stats.byStatus.QUALIFIED || 0) +
    (stats.byStatus.PROPOSAL_SENT || 0);

  const wonCount = stats.byStatus.WON || 0;
  const lostCount = stats.byStatus.LOST || 0;

  return (
    <div className="stats-grid animate-fade-in">
      {/* 1. Total Leads */}
      <div className="stats-card">
        <div className="stats-card__top">
          <span className="stats-card__label">Total Leads</span>
          <div className="stats-card__icon stats-card__icon--blue">
            <Users size={18} />
          </div>
        </div>
        <div className="stats-card__value">{stats.total}</div>
        <div className="stats-card__footer">
          <span className="stats-card__trend stats-card__trend--neutral">
            +{stats.newThisWeek} new this week
          </span>
        </div>
      </div>

      {/* 2. Active In Pipeline */}
      <div className="stats-card">
        <div className="stats-card__top">
          <span className="stats-card__label">In Pipeline</span>
          <div className="stats-card__icon stats-card__icon--amber">
            <Zap size={18} />
          </div>
        </div>
        <div className="stats-card__value">{activePipelineCount}</div>
        <div className="stats-card__footer">
          <span className="stats-card__tag">
            {stats.byStatus.QUALIFIED || 0} qualified • {stats.byStatus.PROPOSAL_SENT || 0} proposals
          </span>
        </div>
      </div>

      {/* 3. Closed Won */}
      <div className="stats-card">
        <div className="stats-card__top">
          <span className="stats-card__label">Won & Converted</span>
          <div className="stats-card__icon stats-card__icon--green">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="stats-card__value">{wonCount}</div>
        <div className="stats-card__footer">
          <span className="stats-card__trend stats-card__trend--positive">
            {wonCount} won vs {lostCount} lost
          </span>
        </div>
      </div>

      {/* 4. Conversion Rate */}
      <div className="stats-card">
        <div className="stats-card__top">
          <span className="stats-card__label">Conversion Rate</span>
          <div className="stats-card__icon stats-card__icon--purple">
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="stats-card__value">{stats.conversionRate}%</div>
        <div className="stats-card__footer">
          <div className="stats-card__bar">
            <div
              className="stats-card__bar-fill"
              style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
