import type { Metadata } from "next";
import { Archivo, Michroma } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Ego Corp | Mídia, Marketing & Performance",
  description:
    "Ousamos, criamos e acreditamos que o subversivo é sinônimo de genialidade. Produtora de mídia, marketing e performance para marcas B2B.",
};

// Marca o <html> antes da primeira pintura para a intro do hero não piscar.
const introFlag = `if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${michroma.variable} ${archivo.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
