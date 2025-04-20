'use client';

import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>TimeTracker - MAGNETIC PLACE</title>
        <meta name="description" content="Sistema de seguimiento de tiempo para empleados" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
