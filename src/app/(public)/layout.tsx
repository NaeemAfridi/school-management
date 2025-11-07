import Footer from "@/components/Footer";
import Header from "@/components/Navbar";

export const metadata = {
  title: "School Management System",
  description: "A modern and user-friendly school management web application.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ======= Header ======= */}
      <Header />

      {/* ======= Main Content ======= */}
      <main className="grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl">{children}</div>
      </main>

      {/* ======= Footer ======= */}
      <Footer />
    </div>
  );
}
