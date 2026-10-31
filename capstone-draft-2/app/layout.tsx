// ------ REFERENCES
/** [1]
 * Description:
 * Reference: Vercel. (n.d.). Font optimization. Next.js Documentation. https://nextjs.org/docs/app/getting-started/fonts
 */
import type { Metadata } from "next";
import { Lato } from "next/font/google"; //[1]
import "./globals.css";
import {Navbar} from "./components/Navbar"; //import navbar

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "UC Capstone",
  description: "Learn about the UC Capstone Project, Mentors and Sponsors, view the Project Showcase, and apply to join",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en">
      <body className={`${lato.variable} flex flex-col min-h-dvh`}>
        <div className = "z-10 shadow-xl">
          <Navbar />
        </div>
        {children}
        </body>
    </html>
  );
}

