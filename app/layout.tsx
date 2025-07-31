import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Jost } from "next/font/google";
import "./globals.css";

import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner";

const jost = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: SERVER_URL,
    siteName: APP_NAME,
    images: [
      {
        url: `${SERVER_URL}/images/logo.svg`,
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${SERVER_URL}/images/logo.svg`],
  },
  alternates: {
    canonical: SERVER_URL,
  },
  keywords: ["ecommerce", "online shopping", "nextjs", "react"],
  icons: [
    {
      media: "(prefers-color-scheme: dark)",
      url: "/images/favicon-dark.ico",
    },
    {
      media: "(prefers-color-scheme: light)",
      url: "/images/favicon-light.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
