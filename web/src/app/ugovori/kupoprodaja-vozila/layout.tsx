import type { Metadata } from 'next';

// Stranica je sklonjena iz menija; ne indeksira se dok ne bude spremna.
export const metadata: Metadata = {
  title: 'Ugovor o kupoprodaji vozila — doQ-menti',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
