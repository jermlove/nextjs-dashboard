"use client";
import React from "react";
import Link from "next/link";

interface DropdownItemProps {
  onItemClick?: () => void;
  tag?: "a" | "button";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ onItemClick, tag = "button", href, className, children }) => {
  if (tag === "a" && href) {
    return (
      <Link href={href} className={className} onClick={onItemClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={onItemClick}>
      {children}
    </button>
  );
};
