import type { Metadata } from "next";
import "./globals.css";
import Header from "./layout/header/Header";
import MSWComponent from "./_component/MSWComponent";
import RQProvider from "./_component/RQProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <MSWComponent />
        <Header />
        <RQProvider>{children}</RQProvider>
      </body>
    </html>
  );
}
