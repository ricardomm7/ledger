import { useState } from 'react';

/**
 * Custom hook para gerenciar estado de um modal de confirmação
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const open = (title, message, onConfirm, onCancel) => {
    setConfig({ title, message, onConfirm, onCancel });
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setConfig({ title: '', message: '', onConfirm: null, onCancel: null });
  };

  const confirm = () => {
    config.onConfirm?.();
    close();
  };

  const cancel = () => {
    config.onCancel?.();
    close();
  };

  return { isOpen, config, open, confirm, cancel, close };
}
