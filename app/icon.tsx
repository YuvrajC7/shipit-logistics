import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="#C70E20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L20 0 A12 12 0 0 1 32 12 L32 14 L12 14 A12 12 0 0 1 0 2 Z" />
          <path d="M32 32 L12 32 A12 12 0 0 1 0 20 L0 18 L20 18 A12 12 0 0 1 32 30 Z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
