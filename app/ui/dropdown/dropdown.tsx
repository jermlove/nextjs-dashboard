"use client";
import React, { useEffect } from "react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({ isOpen, onClose, className, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside() {
      onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className={className}>
      {children}
    </div>
  );
};
