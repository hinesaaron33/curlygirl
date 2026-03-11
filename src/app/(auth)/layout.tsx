export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-light via-base to-base-dark px-4">
      {children}
    </div>
  );
}
