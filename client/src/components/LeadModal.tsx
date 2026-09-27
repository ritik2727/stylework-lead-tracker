import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building, FileText, Loader2 } from 'lucide-react';
import type { CreateLeadPayload, Lead, LeadStatus } from '../types';
import { STATUS_CONFIG } from '../types';
import './LeadModal.css';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadPayload) => Promise<void>;
  leadToEdit?: Lead | null;
}

const ALL_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
];

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  leadToEdit,
}) => {
  const isEditing = !!leadToEdit;

  const [formData, setFormData] = useState<CreateLeadPayload>({
    name: '',
    email: '',
    phone: '',
    status: 'NEW',
    company: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        name: leadToEdit.name,
        email: leadToEdit.email,
        phone: leadToEdit.phone,
        status: leadToEdit.status,
        company: leadToEdit.company || '',
        notes: leadToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'NEW',
        company: '',
        notes: '',
      });
    }
    setErrors({});
  }, [leadToEdit, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid phone number (min 7 digits)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        status: formData.status,
        company: formData.company?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      if (err.details && Array.isArray(err.details)) {
        const fieldErrors: Record<string, string> = {};
        err.details.forEach((d: any) => {
          fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: err.message || 'An error occurred while saving lead' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">
              {isEditing ? 'Edit Lead Details' : 'Create New Lead'}
            </h2>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update contact info, status, or workspace preferences.'
                : 'Add a prospective client to your sales pipeline.'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* General Error Banner */}
        {errors.general && (
          <div className="modal-error-banner">{errors.general}</div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Row 1: Name & Status */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lead-name" className="form-label">
                Lead Name <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="lead-name"
                  type="text"
                  className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  autoFocus
                />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lead-status" className="form-label">
                Initial Status <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <select
                  id="lead-status"
                  className="form-input form-select"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as LeadStatus })
                  }
                >
                  {ALL_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_CONFIG[status].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lead-email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  id="lead-email"
                  type="email"
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  placeholder="e.g. aarav@techcorp.in"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lead-phone" className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <Phone size={16} className="input-icon" />
                <input
                  id="lead-phone"
                  type="tel"
                  className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          {/* Row 3: Company */}
          <div className="form-group">
            <label htmlFor="lead-company" className="form-label">
              Company / Organization <span className="optional">(optional)</span>
            </label>
            <div className="input-wrap">
              <Building size={16} className="input-icon" />
              <input
                id="lead-company"
                type="text"
                className="form-input"
                placeholder="e.g. Stylework Workspace Solutions"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>

          {/* Row 4: Notes */}
          <div className="form-group">
            <label htmlFor="lead-notes" className="form-label">
              Notes & Workspace Requirements <span className="optional">(optional)</span>
            </label>
            <div className="input-wrap">
              <FileText size={16} className="input-icon input-icon--textarea" />
              <textarea
                id="lead-notes"
                className="form-input form-textarea"
                rows={3}
                placeholder="e.g. Looking for 20 dedicated desks with meeting room credits in Gurgaon Cyber City..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
              id="submit-lead-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="btn-spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Lead'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
