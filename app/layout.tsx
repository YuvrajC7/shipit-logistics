import type { Metadata } from "next";
import { Anek_Bangla } from "next/font/google";
import "./globals.css";

const anek = Anek_Bangla({ 
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600"]
});

export const metadata: Metadata = {
  title: "SHIPIT",
  description: "Logistics that move at the speed of light.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anek.variable} font-sans antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
