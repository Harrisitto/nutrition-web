import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useInstagramPosts } from "../../components/info/instagramHook";
import { Button, CarouselNavButton } from "../../components/info/buttons";
import { PhoneMockup } from "@src/components/info/phoneMockup";
import { APP_ROUTES } from "@src/hooks/navigation/routes";
import useAppNavigation from "@src/hooks/navigation";
import { useGetAuthInfo, useGetAuthSession } from "@src/services/tanstack/auth/get";

const PageInfo = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { data: session } = useGetAuthSession();
  const { data: profile } = useGetAuthInfo();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { navigateTo } = useAppNavigation();

  // Fallback de posts desde home.json
  //const fallbackPosts = t("home:instagram.posts", { returnObjects: true }) || [];

  // Token de Instagram desde variable de entorno
  const instagramToken = import.meta.env?.VITE_INSTAGRAM_TOKEN || "";

  // Hook dinámico de Instagram
  const { posts, loading: loadingPosts } = useInstagramPosts(instagramToken);

  // --- OPTIMIZACIÓN HASH ROUTER: Scroll suave entre secciones ---
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Detectar hash en la URL al cargar o cambiar ruta
  useEffect(() => {
    if (location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
    }
  }, [location]);

  // Controles del Carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= posts.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-white-green text-text-body font-sans selection:bg-nutrition-green selection:text-text-light">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white-green/90 backdrop-blur-md border-b border-gray-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-nutrition-green flex items-center justify-center text-white-green font-bold text-xl shadow-md">
              Ez
            </div>
            <span className="text-2xl font-extrabold text-text-title tracking-tight">
              {t("home:nav.brand")}
            </span>
          </div>

          {/* Navegación compatible con HashRouter */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => scrollToSection("features")}
            >
              {t("home:nav.features")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("instagram")}
            >
              {t("home:nav.instagram")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => scrollToSection("pricing")}
            >
              {t("home:nav.pricing")}
            </Button>
          </div>

          <Button variant="dark" size="md" onClick={() => {
            if (!session?.session) {
                  navigateTo(APP_ROUTES.SIGN_UP);
                } else if (profile) {
                  navigateTo(APP_ROUTES.DASHBOARD);
                } else {
                  console.error("Invalid route redirect");
                }
          }}>
            {t("home:nav.login")}
          </Button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-fade-green text-text-title border border-nutrition-green/20">
                {t("home:hero.badge")}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-title leading-tight">
                {t("home:hero.title")}
              </h1>

              <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t("home:hero.subtitle")}
              </p>
            </div>
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 bg-white border-y border-gray-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-text-subtitle bg-gray-blue-100 px-3 py-1 rounded-full">
              {t("home:features.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-title mt-3">
              {t("home:features.title")}
            </h2>
            <p className="text-text-muted mt-3 text-lg">
              {t("home:features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white-green p-8 rounded-2xl border border-gray-blue-200">
              <div className="w-12 h-12 rounded-xl bg-nutrition-green text-text-light flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2">
                {t("home:features.item1_title")}
              </h3>
              <p className="text-text-body text-sm leading-relaxed">
                {t("home:features.item1_desc")}
              </p>
            </div>
            <div className="bg-white-green p-8 rounded-2xl border border-gray-blue-200">
              <div className="w-12 h-12 rounded-xl bg-nutrition-blue text-text-light flex items-center justify-center text-2xl mb-6">
                📱
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2">
                {t("home:features.item2_title")}
              </h3>
              <p className="text-text-body text-sm leading-relaxed">
                {t("home:features.item2_desc")}
              </p>
            </div>
            <div className="bg-white-green p-8 rounded-2xl border border-gray-blue-200">
              <div className="w-12 h-12 rounded-xl bg-dark-green text-text-light flex items-center justify-center text-2xl mb-6">
                ⏱️
              </div>
              <h3 className="text-xl font-bold text-text-title mb-2">
                {t("home:features.item3_title")}
              </h3>
              <p className="text-text-body text-sm leading-relaxed">
                {t("home:features.item3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- INSTAGRAM CAROUSEL (API DINÁMICA) --- */}
      <section id="instagram" className="py-20 bg-white-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-nutrition-purple bg-gray-blue-100 px-3 py-1 rounded-full">
                {t("home:instagram.badge")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-title mt-3">
                {t("home:instagram.title")}
              </h2>
              <p className="text-text-muted mt-2">
                {t("home:instagram.subtitle")}
              </p>
            </div>

            <Button
              variant="instagram"
              size="md"
              className="mt-6 md:mt-0"
              onClick={() => window.open("https://instagram.com", "_blank", "noopener,noreferrer")}
            >
              {t("home:instagram.follow_btn")}
            </Button>
          </div>

          {/* Carrusel */}
          <div className="relative">
            {loadingPosts ? (
              /* Skeleton Loader */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse p-4">
                    <div className="bg-gray-blue-200 h-48 rounded-xl mb-4"></div>
                    <div className="bg-gray-blue-200 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-blue-200 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {posts.map((post) => (
                    <div key={post.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-3">
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-white rounded-2xl border border-gray-blue-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative h-60 overflow-hidden bg-gray-blue-100">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white-green text-xs font-semibold px-2.5 py-1 rounded-full">
                            ❤️ {post.likes}
                          </div>
                        </div>

                        <div className="p-5 space-y-2">
                          <span className="text-xs text-text-muted font-medium">
                            {post.date}
                          </span>
                          <p className="font-bold text-text-title text-base leading-snug group-hover:text-nutrition-green transition-colors line-clamp-2">
                            {post.title}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navegación del carrusel */}
            {!loadingPosts && posts.length > 1 && (
              <>
                <CarouselNavButton direction="prev" onClick={prevSlide} />
                <CarouselNavButton direction="next" onClick={nextSlide} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-20 bg-white border-t border-gray-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-nutrition-green bg-gray-blue-100 px-3 py-1 rounded-full">
              {t("home:pricing.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-title mt-3">
              {t("home:pricing.title")}
            </h2>
            <p className="text-text-muted mt-2 text-lg">
              {t("home:pricing.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="bg-white-green p-8 rounded-3xl border border-gray-blue-200 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-text-title">
                  {t("home:pricing.plan_starter_name")}
                </h3>
                <p className="text-text-muted text-sm mt-1">
                  {t("home:pricing.plan_starter_desc")}
                </p>
                <div className="my-6">
                  <span className="text-4xl font-black text-text-title">
                    {t("home:pricing.plan_starter_price")}
                  </span>
                  <span className="text-text-muted text-sm"> / mes</span>
                </div>
                <ul className="space-y-3 text-sm text-text-body mb-8">
                  <li className="flex items-center space-x-2">
                    <span className="text-nutrition-green font-bold">✓</span>
                    <span>{t("home:pricing.plan_starter_f1")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-nutrition-green font-bold">✓</span>
                    <span>{t("home:pricing.plan_starter_f2")}</span>
                  </li>
                </ul>
              </div>

              <Button variant="stripe-starter" fullWidth size="lg">
                {t("home:pricing.stripe_btn")}
              </Button>
            </div>

            {/* Pro */}
            <div className="bg-dark-green p-8 rounded-3xl text-text-light flex flex-col justify-between relative shadow-xl transform md:-translate-y-2">
              <div className="absolute -top-3 right-8 bg-nutrition-green text-white-green text-xs font-bold px-3 py-1 rounded-full uppercase">
                {t("home:pricing.plan_pro_popular")}
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {t("home:pricing.plan_pro_name")}
                </h3>
                <p className="text-gray-blue-300 text-sm mt-1">
                  {t("home:pricing.plan_pro_desc")}
                </p>
                <div className="my-6">
                  <span className="text-4xl font-black">
                    {t("home:pricing.plan_pro_price")}
                  </span>
                  <span className="text-gray-blue-300 text-sm"> / mes</span>
                </div>
                <ul className="space-y-3 text-sm mb-8">
                  <li className="flex items-center space-x-2">
                    <span className="text-nutrition-green font-bold">✓</span>
                    <span>{t("home:pricing.plan_pro_f1")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-nutrition-green font-bold">✓</span>
                    <span>{t("home:pricing.plan_pro_f2")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-nutrition-green font-bold">✓</span>
                    <span>{t("home:pricing.plan_pro_f3")}</span>
                  </li>
                </ul>
              </div>

              <Button variant="stripe-pro" fullWidth size="lg">
                {t("home:pricing.stripe_btn")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black-green text-text-light py-12 border-t border-dark-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <span className="text-xl font-bold tracking-wide">
              {t("home:nav.brand")}
            </span>
            <p className="text-xs text-gray-blue-300 max-w-sm">
              {t("home:footer.desc")}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-nutrition-green mb-3">
              {t("home:footer.quick_links")}
            </h4>
            <ul className="space-y-2 text-xs text-gray-blue-300">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="hover:text-nutrition-green transition-colors"
                >
                  {t("home:nav.features")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("instagram")}
                  className="hover:text-nutrition-green transition-colors"
                >
                  {t("home:nav.instagram")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="hover:text-nutrition-green transition-colors"
                >
                  {t("home:nav.pricing")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageInfo;
