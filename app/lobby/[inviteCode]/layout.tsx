"use client";

import React from "react";

export default function InviteCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen w-full bg-transparent mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {children}
    </div>
  );
}
