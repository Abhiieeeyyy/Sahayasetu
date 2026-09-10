/**
 * ============================================================================
 * SAHAYASETU FLASH FEEDBACK TOAST NOTIFICATION COMPONENT
 * ============================================================================
 * 
 * Purpose:
 * Provides immediate situational feedback to operators when critical actions
 * are dispatched (e.g. 1-click candidate assignments, automated SMS notifications,
 * offline synchronization events).
 * 
 * Key Capabilities:
 * 1. Urgency Color Coding: Success (Forest Green), Warning (Amber), Error (Crimson).
 * 2. Simulated SMS Carrier Confirmation: Confirms automated outbound Malayalam SMS
 *    dispatches to beneficiaries' mobile devices.
 * 3. Dismissal Control: Manual close button and auto-timeout support.
 */

import React from 'react';
import { ToastNotification } from '../types';

interface ToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast-box toast-${toast.type}`}>
        {/* Status Icon */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: toast.type === 'success' ? 'var(--color-tertiary)' : 'var(--color-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
        </div>

        {/* Message Content */}
        <div style={{ flex: 1, paddingRight: '8px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-on-surface)' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-on-surface-variant)', marginTop: '2px', lineHeight: 1.4 }}>
            {toast.message}
          </div>

          {/* Optional Outbound SMS Indicator */}
          {toast.smsCode && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--color-tertiary)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>sms</span>
              <span>{toast.smsCode}</span>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button 
          onClick={onDismiss} 
          className="btn btn-ghost" 
          style={{ minHeight: '28px', width: '28px', padding: 0, color: 'var(--color-on-surface-variant)' }}
          title="Dismiss notification"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
        </button>
      </div>
    </div>
  );
};
