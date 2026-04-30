
export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>      <main className="min-h-screen">{children}</main>
    </>
  );
}
