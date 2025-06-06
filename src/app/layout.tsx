import './styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Futuristic Image Uploader',
  description: 'Upload and view images with a futuristic UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
