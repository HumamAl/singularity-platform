import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { TabNavigation } from "@/components/layout/tab-navigation";
import { APP_CONFIG } from "@/lib/config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Singularity Platform | Demo by Humam",
  description: "Interactive singularity platform with immersive 3D visuals and secure Vault system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme activates the CSS theme system — dark-premium aesthetic
    // drives all visual treatment via CSS variables.
    <html lang="en" data-theme={APP_CONFIG.aesthetic}>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <TabNavigation />
        {children}
      </body>
    </html>
  );
}
