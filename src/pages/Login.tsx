import LoginComponent from "@/components/Auth/Login";
import Footer from "@/components/LandingPage/Footer";
import Navigation from "@/components/LandingPage/Navigation";

export default function LoginPage() {
  return (
    <div>
      <Navigation />
      <LoginComponent />
      <Footer />
    </div>
  );
}
