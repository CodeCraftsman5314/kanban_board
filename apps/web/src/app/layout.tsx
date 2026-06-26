import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

const METADATA_TITLE = "Kanban Board" as const;
const METADATA_DESCRIPTION = "Kanban board application" as const;

export const metadata: Metadata = {
  title: METADATA_TITLE,
  description: METADATA_DESCRIPTION,
};

function RootLayout({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
