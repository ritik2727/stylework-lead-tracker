import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { Lead } from '../types';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !lead) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(lead.id);
      onClose();
    } catch {
      // error handled by parent toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="delete-modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <div className="delete-modal__icon">
          <AlertTriangle size={28} />
        </div>
        <h3 id="delete-title" className="delete-modal__title">
          Delete Lead?
        </h3>
        <p className="delete-modal__desc">
          Are you sure you want to delete <strong>{lead.name}</strong> ({lead.email})?
          This action will remove the lead from your pipeline and cannot be undone.
        </p>

        <div className="delete-modal__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="btn-spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Permanently</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
