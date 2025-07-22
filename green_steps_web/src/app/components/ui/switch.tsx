'use client';

import React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`w-12 h-6 flex items-center rounded-full px-1 transition ${
        checked ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
