import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProviderWrapper } from "@/components/ClerkProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Mock Interviewer | Practice Technical Interviews",
  description: "Prepare for your dream job with AI-powered mock interviews, MCQ quizzes, and live coding rounds. Get instant, actionable feedback.",
  keywords: ["mock interview", "AI interview", "coding practice", "MCQ prep"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClerkProviderWrapper>
            <Toaster/>
            {children}
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
