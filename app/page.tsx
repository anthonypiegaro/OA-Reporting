import NavBar from "@/components/landing-page/nav-bar/nav-bar";
import Hero from "@/components/landing-page/hero/hero";
import LogoTicker from "@/components/landing-page/logo-ticker/logo-ticker";

export default function Page() {
  return (
    <div className="w-full max-w-[100vw] overflow-y-auto scrollbar-hide">
      <NavBar />
      <Hero />
      <LogoTicker />
      <footer className="h-10"></footer>
    </div>
  );
}
