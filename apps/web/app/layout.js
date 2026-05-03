export const metadata = {
  title: "TeamHub",
  description: "Collaborative workspace platform",
  icons: {
    icon: "/logo.png",
  },
};

import "./globals.css";
import ThemeInitializer from "../components/theme/ThemeInitializer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      >
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
