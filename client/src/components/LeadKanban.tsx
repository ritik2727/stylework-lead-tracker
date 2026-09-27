import React from 'react';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Pencil,
  Trash2,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import type { Lead, LeadStatus } from '../types';
import { STATUS_CONFIG } from '../types';
import './LeadKanban.css';

interface LeadKanbanProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
}

const COLUMNS: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
];

const NEXT_STATUS_MAP: Record<LeadStatus, LeadStatus | null> = {
  NEW: 'CONTACTED',
  CONTACTED: 'QUALIFIED',
  QUALIFIED: 'PROPOSAL_SENT',
  PROPOSAL_SENT: 'WON',
  WON: null,
  LOST: null,
};

export const LeadKanban: React.FC<LeadKanbanProps> = ({
  leads,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || 'LD').toUpperCase();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <div key={col} className="kanban-column skeleton" style={{ height: '500px' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="kanban-board animate-fade-in">
      {COLUMNS.map((columnKey) => {
        const config = STATUS_CONFIG[columnKey];
        const columnLeads = leads.filter((lead) => lead.status === columnKey);
        const nextStatus = NEXT_STATUS_MAP[columnKey];

        return (
          <div key={columnKey} className="kanban-column">
            {/* Column Header */}
            <div className="kanban-column__header">
              <div className="kanban-column__title-wrap">
                <span
                  className="kanban-column__dot"
                  style={{ backgroundColor: config.dot }}
                />
                <span className="kanban-column__title">{config.label}</span>
              </div>
              <span
                className="kanban-column__count"
                style={{ backgroundColor: config.bg, color: config.color }}
              >
                {columnLeads.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="kanban-column__body">
              {columnLeads.length === 0 ? (
                <div className="kanban-column__empty">
                  <Inbox size={24} />
                  <span>No leads in this stage</span>
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <div key={lead.id} className="kanban-card">
                    {/* Card Top: Avatar, Name, Company */}
                    <div className="kanban-card__top">
                      <div className="kanban-card__avatar">
                        {getInitials(lead.name)}
                      </div>
                      <div className="kanban-card__identity">
                        <div className="kanban-card__name">{lead.name}</div>
                        {lead.company && (
                          <div className="kanban-card__company">
                            <Building size={11} />
                            <span>{lead.company}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="kanban-card__contact">
                      <a
                        href={`mailto:${lead.email}`}
                        className="kanban-card__link"
                        title={lead.email}
                      >
                        <Mail size={12} />
                        <span>{lead.email}</span>
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        className="kanban-card__link"
                        title={lead.phone}
                      >
                        <Phone size={12} />
                        <span>{lead.phone}</span>
                      </a>
                    </div>

                    {/* Notes preview if any */}
                    {lead.notes && (
                      <div className="kanban-card__notes">
                        "{lead.notes.length > 70 ? `${lead.notes.slice(0, 70)}...` : lead.notes}"
                      </div>
                    )}

                    {/* Card Footer: Date, advance button, actions */}
                    <div className="kanban-card__footer">
                      <div className="kanban-card__date">
                        <Calendar size={11} />
                        <span>{formatDate(lead.createdAt)}</span>
                      </div>

                      <div className="kanban-card__actions">
                        {nextStatus && (
                          <button
                            type="button"
                            className="kanban-card__advance-btn"
                            onClick={() => onStatusChange(lead.id, nextStatus)}
                            title={`Advance to ${STATUS_CONFIG[nextStatus].label}`}
                          >
                            <span>Next</span>
                            <ArrowRight size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="kanban-card__icon-btn"
                          onClick={() => onEdit(lead)}
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="kanban-card__icon-btn kanban-card__icon-btn--delete"
                          onClick={() => onDelete(lead)}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
