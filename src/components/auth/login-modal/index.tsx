'use client';

import React from 'react';
import { LoginCard } from '../login-card';

export function LoginModal({
  isOpen = true,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <LoginCard onSuccess={onClose} />
    </div>
  );
}
