import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LoginModalProvider } from "@/components/auth/login-modal";
import { CheckoutModalProvider } from "@/components/checkout/checkout-modal";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginModalProvider>
      <CheckoutModalProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </CheckoutModalProvider>
    </LoginModalProvider>
  );
}
