import "./globals.css";

export const metadata = {
  title: "SOMEWHERE — Sandip Chapagain",
  description: "A personal space for ideas, experiments, and things still becoming.",
  metadataBase: new URL("https://somewhere.example")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
