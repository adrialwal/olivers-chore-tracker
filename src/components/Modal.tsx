import { useEffect, type ReactNode } from 'react';

interface Props {
  title?: string;
  onClose?: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ title, onClose, children, wide }: Props) {
  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={'modal card' + (wide ? ' modal-wide' : '')} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {(title || onClose) && (
          <div className="modal-head">
            {title && <h2>{title}</h2>}
            {onClose && (
              <button className="icon-btn" onClick={onClose} aria-label="Close">
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal(props: {
  title: string;
  message?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={props.title} onClose={props.onCancel}>
      {props.message && <div className="modal-message">{props.message}</div>}
      <div className="row-end">
        <button className="btn" onClick={props.onCancel}>
          {props.cancelLabel ?? 'Cancel'}
        </button>
        <button className={'btn ' + (props.danger ? 'btn-danger' : 'btn-primary')} onClick={props.onConfirm}>
          {props.confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
