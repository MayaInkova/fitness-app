import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {/*  h-16 = 64 px; +8 px safety → pt-20 */}
      <main className="pt-20 pb-10 min-h-screen bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}