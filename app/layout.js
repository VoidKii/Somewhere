import "./globals.css";

export const metadata = {
  title: "SOMEWHERE® — Sandip Chapagain",
  description: "A personal digital space by Sandip Chapagain — ideas, experiments, creative work, and things still becoming.",
  applicationName: "SOMEWHERE",
  authors: [{ name: "Sandip Chapagain" }],
  creator: "Sandip Chapagain"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
