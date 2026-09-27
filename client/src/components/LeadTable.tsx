import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  Pencil,
  Trash2,
  Building,
  User,
  Inbox,
} from 'lucide-react';
import type { Lead, LeadStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { StatusDropdown } from './StatusDropdown';
import './LeadTable.css';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

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
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="lead-table-wrapper">
        <table className="lead-table">
          <thead>
            <tr>
              <th>Lead Name & Company</th>
              <th>Contact Details</th>
              <th>Status</th>
              <th>Date Added</th>
              <th className="lead-table__th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td colSpan={5}>
                  <div className="skeleton" style={{ height: '42px', margin: '4px 0' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="lead-table-empty">
        <div className="lead-table-empty__icon">
          <Inbox size={40} />
        </div>
        <h3>No Leads Found</h3>
        <p>Try refining your search terms or filter criteria, or add a new lead to get started.</p>
      </div>
    );
  }

  return (
    <div className="lead-table-wrapper animate-fade-in">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Lead Name & Company</th>
            <th>Contact Details</th>
            <th>Status</th>
            <th>Created At</th>
            <th className="lead-table__th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const isDropdownOpen = activeDropdownId === lead.id;

            return (
              <tr key={lead.id} className="lead-table__row">
                {/* 1. Name & Company */}
                <td className="lead-table__col-name">
                  <div className="lead-table__name-wrap">
                    <div className="lead-table__avatar">
                      {getInitials(lead.name)}
                    </div>
                    <div className="lead-table__name-info">
                      <div className="lead-table__name">{lead.name}</div>
                      {lead.company ? (
                        <div className="lead-table__company">
                          <Building size={12} />
                          <span>{lead.company}</span>
                        </div>
                      ) : (
                        <div className="lead-table__company lead-table__company--none">
                          <User size={12} />
                          <span>Individual Client</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* 2. Contact Details (Email + Phone) */}
                <td className="lead-table__col-contact">
                  <div className="lead-table__contact-item">
                    <Mail size={13} className="lead-table__contact-icon" />
                    <a
                      href={`mailto:${lead.email}`}
                      className="lead-table__link"
                      title="Send email"
                    >
                      {lead.email}
                    </a>
                  </div>
                  <div className="lead-table__contact-item">
                    <Phone size={13} className="lead-table__contact-icon" />
                    <a
                      href={`tel:${lead.phone}`}
                      className="lead-table__link"
                      title="Call phone number"
                    >
                      {lead.phone}
                    </a>
                  </div>
                </td>

                {/* 3. Status with Quick Dropdown */}
                <td className="lead-table__col-status">
                  <div className="lead-table__status-wrap">
                    <StatusBadge
                      status={lead.status}
                      interactive
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(isDropdownOpen ? null : lead.id);
                      }}
                    />
                    <StatusDropdown
                      currentStatus={lead.status}
                      isOpen={isDropdownOpen}
                      onClose={() => setActiveDropdownId(null)}
                      onSelect={(newStatus) => onStatusChange(lead.id, newStatus)}
                    />
                  </div>
                </td>

                {/* 4. Created At Date */}
                <td className="lead-table__col-date">
                  <div className="lead-table__date-wrap">
                    <Calendar size={13} className="lead-table__date-icon" />
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </td>

                {/* 5. Actions */}
                <td className="lead-table__col-actions">
                  <div className="lead-table__actions">
                    <button
                      type="button"
                      className="lead-table__action-btn lead-table__action-btn--edit"
                      onClick={() => onEdit(lead)}
                      title="Edit lead"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="lead-table__action-btn lead-table__action-btn--delete"
                      onClick={() => onDelete(lead)}
                      title="Delete lead"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
