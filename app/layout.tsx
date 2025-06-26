// app/layout.tsx

export const metadata = {
  title: "숨보 Sumbo",
  description: "숨겨진 보물을 찾는 지도 기반 미션 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
