import { useState, useMemo, useEffect, type ReactNode, type AnchorHTMLAttributes } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  ShoppingBag,
  UserRound,
  Search,
  Menu,
  X,
  Truck,
  CreditCard,
  RotateCcw,
  Plus,
  Minus,
  ChevronDown,
  SlidersHorizontal,
  Check,
  PackageCheck,
  Instagram,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Mail,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import hero from "@/assets/kiwi-collection.webp";
import wideHero from "@/assets/kiwi-collection-wide.webp";
import mobileHero from "@/assets/kiwi-collection-mobile.webp";
import {
  categories,
  products,
  sizes,
  subtotal,
  shippingRemaining,
  type Product,
} from "@/lib/store/data";
import { makeI18n, isLanguage, type Language } from "@/lib/store/translations";
import { useStore } from "@/lib/store/context";

export function Storefront({ language = "ro", path = "" }: { language?: string; path?: string }) {
  const lang = isLanguage(language) ? language : "ro";
  const location = useLocation();
  const instance = useMemo(() => makeI18n(lang), [lang]);
  useEffect(() => {
    document.documentElement.lang = lang;
    if (location.pathname !== "/") localStorage.setItem("kiwi-language", lang);
  }, [lang, location.pathname]);
  return (
    <I18nextProvider i18n={instance}>
      <Shop language={lang} path={path} />
    </I18nextProvider>
  );
}
function Shop({ language, path }: { language: Language; path: string }) {
  const { t } = useTranslation();
  const section = path.split("/")[0];
  return (
    <>
      <Header language={language} path={path} />
      <main>
        {!path ? (
          <Home language={language} />
        ) : section === "catalog" ? (
          <Catalog language={language} path={path} />
        ) : section === "product" ? (
          <ProductPage language={language} slug={path.split("/")[1] ?? ""} />
        ) : section === "cart" ? (
          <CartPage language={language} />
        ) : section === "checkout" ? (
          <Checkout language={language} />
        ) : section === "wishlist" ? (
          <Wishlist language={language} />
        ) : section === "account" ? (
          <Account />
        ) : section === "admin" ? (
          <Admin />
        ) : section === "help" ? (
          <HelpPage path={path} />
        ) : (
          <div className="container page-space">
            <h1>{t("noResults")}</h1>
            <ShopLink language={language} path="catalog">
              {t("catalogCta")}
            </ShopLink>
          </div>
        )}
      </main>
      <Newsletter />
      <Footer language={language} />
      <CartDrawer language={language} />
    </>
  );
}
function ShopLink({
  language,
  path = "",
  children,
  className,
  ...anchorProps
}: {
  language: Language;
  path?: string;
  children: ReactNode;
  className?: string;
} & Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick" | "title" | "aria-label" | "aria-pressed" | "tabIndex"
>) {
  const [pathname, queryString] = path.split("?");
  const to = path
    ? { pathname: `/${language}/${pathname ?? ""}`, search: queryString ? `?${queryString}` : "" }
    : `/${language}`;
  return (
    <Link to={to} className={className} {...anchorProps}>
      {children}
    </Link>
  );
}
function Header({ language, path }: { language: Language; path: string }) {
  const { t } = useTranslation();
  const store = useStore();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const links = [
    ["girls", "catalog?gender=girls"],
    ["boys", "catalog?gender=boys"],
    ["performance", "catalog/performance"],
    ["new", "catalog"],
    ["sale", "catalog?sale=1"],
  ];
  const navLink = (key: string, destination: string) => {
    const [pathname, queryString] = destination.split("?");
    return (
      <Link
        key={key}
        to={{
          pathname: `/${language}/${pathname ?? "catalog"}`,
          search: queryString ? `?${queryString}` : "",
        }}
        onClick={() => setMenu(false)}
        className={key === "sale" ? "sale-link" : ""}
      >
        {t(key)}
      </Link>
    );
  };
  const result = products.filter((p) => t(p.nameKey).toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span className="shipping-message">
            <Truck size={14} />
            {t("shipping")}
          </span>
          <div>
            <a href="tel:+37360789455">+373 60 789 455</a>
            <span className="topbar-divider">|</span>
            <span>{t("hours")}</span>
          </div>
        </div>
      </div>
      <header className="main-header">
        <div className="container header-inner">
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label={t("menu")}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </Button>
          <ShopLink language={language} className="logo">
            <span>
              kiwi<span className="logo-dot">.</span>
            </span>
            <span className="logo-caption">
              KIDS
              <br />
              ACTIVEWEAR
            </span>
          </ShopLink>
          <nav className="desktop-nav">
            {links.map(([key, destination]) =>
              key && destination ? navLink(key, destination) : null,
            )}
          </nav>
          <div className="header-tools">
            <div className="language-switch">
              {(["ro", "ru", "en"] as Language[]).map((lang) => (
                <ShopLink
                  key={lang}
                  language={lang}
                  path={path}
                  className={language === lang ? "selected" : ""}
                >
                  {lang.toUpperCase()}
                </ShopLink>
              ))}
            </div>
            <select
              className="mobile-language"
              value={language}
              aria-label={t("languageLabel")}
              onChange={(e) => navigate(path ? `/${e.target.value}/${path}` : `/${e.target.value}`)}
            >
              <option value="ro">RO</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("searchShort")}
              title={t("searchShort")}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search />
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="account-icon"
              title={t("account")}
            >
              <ShopLink language={language} path="account">
                <UserRound />
              </ShopLink>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="wishlist-icon"
              title={t("wishlist")}
            >
              <ShopLink language={language} path="wishlist">
                <Heart />
                <span className="sr-only">{t("wishlist")}</span>
              </ShopLink>
            </Button>
            <Button
              variant="kiwi"
              className="cart-trigger"
              onClick={() => store.setCartOpen(true)}
              aria-label={t("cart")}
            >
              <ShoppingBag />
              <span className="cart-count">{store.cart.reduce((n, i) => n + i.quantity, 0)}</span>
              <span className="cart-total">
                {subtotal(store.cart)} {t("lei")}
              </span>
            </Button>
          </div>
        </div>
        {searchOpen && (
          <div className="search-panel container">
            <div className="search-field">
              <Search size={20} />
              <input
                autoFocus
                placeholder={t("search")}
                aria-label={t("searchShort")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("close")}
                onClick={() => setSearchOpen(false)}
              >
                <X />
              </Button>
            </div>
            {query && (
              <div className="search-results">
                {result.length ? (
                  result.map((p) => (
                    <ShopLink key={p.id} language={language} path={`product/${p.slug}`}>
                      <div onClick={() => setSearchOpen(false)}>
                        <img src={p.image} alt={t(p.nameKey)} />
                        <span>{t(p.nameKey)}</span>
                        <strong>
                          {p.price} {t("lei")}
                        </strong>
                      </div>
                    </ShopLink>
                  ))
                ) : (
                  <p>{t("noResults")}</p>
                )}
              </div>
            )}
          </div>
        )}
        {menu && (
          <nav className="mobile-nav">
            {links.map(([key, destination]) =>
              key && destination ? navLink(key, destination) : null,
            )}
            <ShopLink language={language} path="account">
              {t("account")}
            </ShopLink>
            <ShopLink language={language} path="wishlist">
              {t("wishlist")}
            </ShopLink>
          </nav>
        )}
      </header>
    </>
  );
}
function Home({ language }: { language: Language }) {
  const { t } = useTranslation();
  const [gender, setGender] = useState("all");
  const list = products.filter(
    (p) => gender === "all" || p.gender === "unisex" || p.gender === gender,
  );
  return (
    <>
      <section className="hero">
        <picture>
          <source media="(max-width: 700px)" srcSet={mobileHero} />
          <img className="hero-photo" src={wideHero} alt={t("heroCopy")} fetchPriority="high" />
        </picture>
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-line" />
              {t("season")}
            </div>
            <h1>
              {t("hero1")}
              <br />
              <span>{t("hero2")}</span>
            </h1>
            <p>{t("heroCopy")}</p>
            <div className="hero-actions">
              <Button size="lg" asChild>
                <ShopLink language={language} path="catalog">
                  {t("catalogCta")}
                  <ArrowUpRight size={18} />
                </ShopLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <ShopLink language={language} path="catalog/performance">
                  {t("performance")}
                </ShopLink>
              </Button>
            </div>
            <div className="hero-trust">
              <span>
                <Truck />
                {t("delivery")}
              </span>
              <span>
                <CreditCard />
                {t("cardPay")}
              </span>
              <span>
                <RotateCcw />
                {t("returns")}
              </span>
            </div>
          </div>
        </div>
        <div className="hero-sticker">
          <span>kiwi kids</span>
          <ArrowUpRight />
          <strong>{t("sticker")}</strong>
        </div>
        <div className="hero-bottom">
          <span>{t("movement")}</span>
          <span>02 — 12</span>
        </div>
      </section>
      <section className="container categories-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("movement")}</p>
            <h2>{t("categoryTitle")}</h2>
            <p>{t("categoryCopy")}</p>
          </div>
          <span className="section-number">01 /</span>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <ShopLink
              key={cat.slug}
              language={language}
              path={`catalog/${cat.slug}`}
              className="category-tile"
            >
              <div className="category-image">
                <img src={cat.image} alt={t(cat.key)} loading="lazy" />
              </div>
              <span>
                {t(cat.key)}
                <ArrowUpRight size={18} />
              </span>
            </ShopLink>
          ))}
        </div>
      </section>
      <section className="container bestsellers">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("essentials")}</p>
            <h2>{t("loved")}</h2>
            <p>{t("lovedCopy")}</p>
          </div>
          <Button asChild variant="link">
            <ShopLink language={language} path="catalog">
              {t("viewAll")}
              <ArrowUpRight />
            </ShopLink>
          </Button>
        </div>
        <div className="product-tabs">
          {["all", "girls", "boys"].map((key) => (
            <Button
              key={key}
              variant={gender === key ? "default" : "ghost"}
              onClick={() => setGender(key)}
            >
              {t(key)}
            </Button>
          ))}
        </div>
        <div className="home-products">
          {list.map((p) => (
            <ProductCard product={p} language={language} key={p.id} />
          ))}
          <div className="collection-tile">
            <img src={hero} alt={t("performance")} loading="lazy" />
            <div>
              <span className="eyebrow">{t("collection")}</span>
              <h3>{t("explore")}</h3>
              <Button asChild variant="kiwi">
                <ShopLink language={language} path="catalog/performance">
                  {t("discover")}
                  <ArrowUpRight />
                </ShopLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="why-section">
        <div className="container">
          <div className="why-heading">
            <p className="eyebrow">{t("whyEyebrow")}</p>
            <h2>{t("why")}</h2>
            <span className="why-brand">kiwi.</span>
          </div>
          <div className="why-grid">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <span className="why-number">0{n}</span>
                <h3>{t(`why${n}`)}</h3>
                <p>{t(`why${n}copy`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
function ProductCard({ product, language }: { product: Product; language: Language }) {
  const { t } = useTranslation();
  const store = useStore();
  const wished = store.wishlist.includes(product.id);
  return (
    <article className="product-card">
      <div className="product-picture">
        <ShopLink language={language} path={`product/${product.slug}`}>
          <img src={product.image} alt={t(product.nameKey)} loading="lazy" />
        </ShopLink>
        <Button
          size="icon"
          variant="outline"
          className={`wish-button ${wished ? "is-wished" : ""}`}
          onClick={() => store.toggleWish(product.id)}
          aria-label={t("wishlist")}
          aria-pressed={wished}
        >
          <Heart />
        </Button>
        <ShopLink language={language} path={`product/${product.slug}`} className="product-quick">
          <span>{t("details")}</span>
          <ArrowUpRight size={18} />
        </ShopLink>
      </div>
      <div className="product-meta">
        <span>
          {t("tops")}
          <span className="meta-dot">·</span>
          {t("ages")}
        </span>
        <ShopLink language={language} path={`product/${product.slug}`}>
          <h3>{t(product.nameKey)}</h3>
        </ShopLink>
        <div>
          <strong>
            {product.price} {t("lei")}
          </strong>
          <span className="white-swatch" title={t("white")} />
        </div>
      </div>
    </article>
  );
}
function Breadcrumbs({ language, children }: { language: Language; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="breadcrumbs">
      <ShopLink language={language}>{t("home")}</ShopLink>
      <span>/</span>
      {children}
    </div>
  );
}
function Catalog({ language, path }: { language: Language; path: string }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const cat = path.split("/")[1] ?? "";
  const gender = query.get("gender") ?? "";
  const sort = query.get("sort") ?? "popular";
  const [filterOpen, setFilterOpen] = useState(false);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    navigate({
      pathname: `/${language}/${path}`,
      search: next.toString() ? `?${next.toString()}` : "",
    });
  };
  const filtered = products
    .filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!gender || p.gender === gender || p.gender === "unisex") &&
        (!query.get("age") || sizes.includes(query.get("age") ?? "")) &&
        !query.get("sale") &&
        p.price >= Number(query.get("min") ?? 0) &&
        p.price <= Number(query.get("max") ?? 1000),
    )
    .sort((a, b) =>
      sort === "ascending" ? a.price - b.price : sort === "descending" ? b.price - a.price : 0,
    );
  const category = categories.find((c) => c.slug === cat);
  const filters = (
    <>
      <div className="filter-section">
        <h3>{t("age")}</h3>
        <div className="size-filter">
          {["2–3", "3–4", ...sizes].map((size) => (
            <Button
              key={size}
              variant={query.get("age") === size ? "default" : "outline"}
              size="sm"
              onClick={() => update("age", query.get("age") === size ? "" : size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h3>{t("color")}</h3>
        <label className="check-row">
          <input
            type="checkbox"
            checked={query.get("color") === "white"}
            onChange={(e) => update("color", e.target.checked ? "white" : "")}
          />
          <span className="white-swatch" />
          {t("white")}
        </label>
      </div>
      <div className="filter-section">
        <h3>
          {t("price")} ({t("lei")})
        </h3>
        <div className="price-inputs">
          <input
            type="number"
            min="0"
            placeholder="0"
            aria-label={`${t("price")} min`}
            value={query.get("min") ?? ""}
            onChange={(e) => update("min", e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            min="0"
            placeholder="1000"
            aria-label={`${t("price")} max`}
            value={query.get("max") ?? ""}
            onChange={(e) => update("max", e.target.value)}
          />
        </div>
      </div>
      <div className="filter-section">
        <h3>{t("gender")}</h3>
        {["girls", "boys", "unisex"].map((g) => (
          <label className="check-row" key={g}>
            <input
              type="checkbox"
              checked={gender === g}
              onChange={(e) => update("gender", e.target.checked ? g : "")}
            />
            {t(g)}
          </label>
        ))}
      </div>
      <div className="filter-section">
        <label className="check-row">
          <input
            type="checkbox"
            checked={query.get("stock") === "1"}
            onChange={(e) => update("stock", e.target.checked ? "1" : "")}
          />
          {t("inStock")}
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={query.get("sale") === "1"}
            onChange={(e) => update("sale", e.target.checked ? "1" : "")}
          />
          {t("onSale")}
        </label>
      </div>
      <Button
        variant="link"
        onClick={() => navigate({ pathname: `/${language}/${path}`, search: "" })}
      >
        <RotateCcw />
        {t("clear")}
      </Button>
    </>
  );
  return (
    <div className="container page-space">
      <Breadcrumbs language={language}>{t("catalog")}</Breadcrumbs>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">KIWI KIDS ACTIVEWEAR</p>
          <h1>{category ? t(category.key) : gender ? t(gender) : t("catalog")}</h1>
          <p>
            {filtered.length} {t("products")}
          </p>
        </div>
        <div className="catalog-controls">
          <Button variant="outline" className="filter-mobile" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal />
            {t("filters")}
          </Button>
          <select
            value={sort}
            aria-label={t("sort")}
            onChange={(e) => update("sort", e.target.value)}
          >
            {["popular", "ascending", "descending", "newest"].map((s) => (
              <option key={s} value={s}>
                {t(s)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="category-chips">
        <Button asChild variant={!cat ? "default" : "outline"}>
          <ShopLink language={language} path="catalog">
            {t("all")}
          </ShopLink>
        </Button>
        {categories.map((c) => (
          <Button key={c.slug} asChild variant={cat === c.slug ? "default" : "outline"}>
            <ShopLink language={language} path={`catalog/${c.slug}`}>
              {t(c.key)}
            </ShopLink>
          </Button>
        ))}
      </div>
      <div className="catalog-layout">
        <aside className="filter-sidebar">
          <h2>{t("filters")}</h2>
          {filters}
        </aside>
        <div>
          {filtered.length ? (
            <div className="catalog-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} language={language} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Package size={40} />
              <h2>{t("empty")}</h2>
              <p>{t("emptyCopy")}</p>
              <Button asChild>
                <ShopLink language={language} path="catalog">
                  {t("viewAll")}
                </ShopLink>
              </Button>
            </div>
          )}
        </div>
      </div>
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="filter-sheet">
          <SheetTitle>{t("filters")}</SheetTitle>
          <SheetDescription>{t("catalog")}</SheetDescription>
          {filters}
          <Button className="w-full" onClick={() => setFilterOpen(false)}>
            {t("viewAll")}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
function ProductPage({ language, slug }: { language: Language; slug: string }) {
  const { t } = useTranslation();
  const p = products.find((p) => p.slug === slug);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [guide, setGuide] = useState(false);
  const [zoom, setZoom] = useState(false);
  const store = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    setSize("");
    setQty(1);
  }, [slug]);
  if (!p)
    return (
      <div className="container empty-state">
        <h1>{t("noResults")}</h1>
        <Button asChild>
          <ShopLink language={language} path="catalog">
            {t("catalogCta")}
          </ShopLink>
        </Button>
      </div>
    );
  const add = () => store.add(p.id, size, qty);
  return (
    <div className="container page-space product-page">
      <Breadcrumbs language={language}>
        <ShopLink language={language} path="catalog">
          {t("catalog")}
        </ShopLink>
        <span>/</span>
        {t(p.nameKey)}
      </Breadcrumbs>
      <div className="product-layout">
        <div className="product-gallery">
          <div className="product-thumbnails">
            <Button
              variant="outline"
              className="thumbnail"
              aria-label={t("zoom")}
              onClick={() => setZoom(true)}
            >
              <img src={p.image} alt={t(p.nameKey)} />
            </Button>
          </div>
          <Button
            variant="ghost"
            className="gallery-main"
            aria-label={t("zoom")}
            onClick={() => setZoom(true)}
          >
            <img src={p.image} alt={t(p.nameKey)} />
            <span className="zoom-label">
              <Plus size={19} />
            </span>
          </Button>
        </div>
        <div className="product-details">
          <p className="eyebrow">
            {t("collection")} <span className="sku">{p.sku}</span>
          </p>
          <h1>{t(p.nameKey)}</h1>
          <div className="price-stock">
            <strong>
              {p.price} {t("lei")}
            </strong>
            <span>
              <span className="stock-dot" />
              {t("stock")}
            </span>
          </div>
          <div className="product-option">
            <span>
              {t("color")}: <strong>{t("white")}</strong>
            </span>
            <Button
              size="icon"
              variant="outline"
              className="color-choice"
              aria-label={t("white")}
              aria-pressed
            >
              <span className="white-swatch" />
            </Button>
          </div>
          <div className="size-heading">
            <span>{t("size")}</span>
            <Button variant="link" onClick={() => setGuide(true)}>
              <Ruler />
              {t("sizeGuide")}
            </Button>
          </div>
          <div className="size-options">
            {sizes.map((s) => (
              <Button
                key={s}
                variant={size === s ? "default" : "outline"}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="purchase-row">
            <Quantity value={qty} onChange={setQty} />
            <Button size="lg" className="add-button" disabled={!size} onClick={add}>
              <ShoppingBag />
              {t(size ? "add" : "selectSize")}
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label={t("wishlist")}
              aria-pressed={store.wishlist.includes(p.id)}
              onClick={() => store.toggleWish(p.id)}
            >
              <Heart />
            </Button>
          </div>
          <Button
            size="lg"
            variant="kiwi"
            className="w-full"
            disabled={!size}
            onClick={() => {
              add();
              store.setCartOpen(false);
              navigate(`/${language}/checkout`);
            }}
          >
            {t("buyNow")}
            <ArrowRight />
          </Button>
          <div className="product-perks">
            <span>
              <Truck />
              {t("shippingFrom")}
            </span>
            <span>
              <PackageCheck />
              {t("delivery")}
            </span>
            <span>
              <RotateCcw />
              {t("sizeExchange")}
            </span>
          </div>
          {["description", "material", "sizeGuide"].map((key) => (
            <details className="product-accordion" key={key}>
              <summary>
                {t(key)}
                <Plus size={18} />
              </summary>
              <p>
                {t(
                  key === "description"
                    ? "descriptionCopy"
                    : key === "material"
                      ? "materialCopy"
                      : "sizePreview",
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
      <section className="related">
        <div className="section-heading">
          <h2>{t("outfit")}</h2>
        </div>
        <div className="related-grid">
          {products
            .filter((other) => other.id !== p.id)
            .map((other) => (
              <ProductCard product={other} language={language} key={other.id} />
            ))}
        </div>
      </section>
      <div className="mobile-add-bar">
        <strong>
          {p.price} {t("lei")}
        </strong>
        <Button disabled={!size} onClick={add}>
          {t(size ? "add" : "selectSize")}
          <ShoppingBag />
        </Button>
      </div>
      <Sheet open={guide} onOpenChange={setGuide}>
        <SheetContent className="guide-sheet">
          <SheetTitle>{t("sizeGuide")}</SheetTitle>
          <SheetDescription>{t("sizePreview")}</SheetDescription>
          <div className="guide-content">
            <Ruler size={44} />
            <h3>
              {t("age")} · {t("height")}
            </h3>
            <p>{t("sizeNote")}</p>
            <div className="size-options">
              {sizes.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => {
                    setSize(s);
                    setGuide(false);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={zoom} onOpenChange={setZoom}>
        <SheetContent className="zoom-sheet">
          <SheetTitle>{t(p.nameKey)}</SheetTitle>
          <SheetDescription>{t("zoom")}</SheetDescription>
          <img src={p.image} alt={t(p.nameKey)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
function Quantity({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { t } = useTranslation();
  return (
    <div className="quantity">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`${t("quantity")} −`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus />
      </Button>
      <span>{value}</span>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`${t("quantity")} +`}
        disabled={value >= 10}
        onClick={() => onChange(value + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}
function CartItems({ language }: { language: Language }) {
  const { t } = useTranslation();
  const store = useStore();
  return (
    <div className="cart-items">
      {store.cart.map((item) => {
        const p = products.find((p) => p.id === item.productId);
        if (!p) return null;
        return (
          <div className="cart-item" key={`${item.productId}-${item.size}`}>
            <ShopLink language={language} path={`product/${p.slug}`}>
              <img src={p.image} alt={t(p.nameKey)} />
            </ShopLink>
            <div>
              <ShopLink language={language} path={`product/${p.slug}`}>
                <h3>{t(p.nameKey)}</h3>
              </ShopLink>
              <p>
                {t("white")} / {item.size}
              </p>
              <strong>
                {p.price * item.quantity} {t("lei")}
              </strong>
              <div className="cart-item-tools">
                <Quantity
                  value={item.quantity}
                  onChange={(v) => store.quantity(item.productId, item.size, v)}
                />
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => store.quantity(item.productId, item.size, 0)}
                >
                  {t("remove")}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function ShippingProgress() {
  const { t } = useTranslation();
  const { cart } = useStore();
  const total = subtotal(cart);
  return (
    <div className="shipping-progress">
      <p>
        <Truck size={18} />
        {shippingRemaining(total)
          ? t("remaining", { amount: shippingRemaining(total) })
          : t("freeShipping")}
      </p>
      <progress max="600" value={Math.min(600, total)} />
    </div>
  );
}
function CartSummary({ language }: { language: Language }) {
  const { t } = useTranslation();
  const { cart, setCartOpen } = useStore();
  const [message, setMessage] = useState("");
  return (
    <div className="cart-summary">
      <ShippingProgress />
      <form
        className="promo-form"
        onSubmit={(e) => {
          e.preventDefault();
          setMessage(t("promoUnavailable"));
        }}
      >
        <input placeholder={t("promo")} aria-label={t("promo")} />
        <Button variant="outline" type="submit">
          {t("apply")}
        </Button>
      </form>
      {message && (
        <p className="form-note" role="status">
          {message}
        </p>
      )}
      <div className="total-line">
        <span>{t("subtotal")}</span>
        <strong>
          {subtotal(cart)} {t("lei")}
        </strong>
      </div>
      <Button asChild size="lg" className="w-full" onClick={() => setCartOpen(false)}>
        <ShopLink language={language} path="checkout">
          {t("checkout")}
          <ArrowRight />
        </ShopLink>
      </Button>
    </div>
  );
}
function CartDrawer({ language }: { language: Language }) {
  const { t } = useTranslation();
  const store = useStore();
  return (
    <Sheet open={store.cartOpen} onOpenChange={store.setCartOpen}>
      <SheetContent className="cart-drawer">
        <SheetTitle className="drawer-title">
          {t("cart")} <span>({store.cart.reduce((n, i) => n + i.quantity, 0)})</span>
        </SheetTitle>
        <SheetDescription>{t("made")}</SheetDescription>
        {store.cart.length ? (
          <>
            <div className="cart-scroll">
              <CartItems language={language} />
            </div>
            <CartSummary language={language} />
          </>
        ) : (
          <div className="empty-state">
            <ShoppingBag size={42} />
            <h2>{t("emptyCart")}</h2>
            <Button asChild onClick={() => store.setCartOpen(false)}>
              <ShopLink language={language} path="catalog">
                {t("catalogCta")}
                <ArrowRight />
              </ShopLink>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
function CartPage({ language }: { language: Language }) {
  const { t } = useTranslation();
  const { cart } = useStore();
  return (
    <div className="container page-space">
      <Breadcrumbs language={language}>{t("cart")}</Breadcrumbs>
      <h1>{t("cart")}</h1>
      {cart.length ? (
        <div className="cart-page-grid">
          <CartItems language={language} />
          <CartSummary language={language} />
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={48} />
          <h2>{t("emptyCart")}</h2>
          <Button asChild>
            <ShopLink language={language} path="catalog">
              {t("continue")}
            </ShopLink>
          </Button>
        </div>
      )}
    </div>
  );
}
function Wishlist({ language }: { language: Language }) {
  const { t } = useTranslation();
  const { wishlist } = useStore();
  return (
    <div className="container page-space">
      <Breadcrumbs language={language}>{t("wishlist")}</Breadcrumbs>
      <h1>{t("wishlist")}</h1>
      {wishlist.length ? (
        <div className="wishlist-grid">
          {products
            .filter((p) => wishlist.includes(p.id))
            .map((p) => (
              <ProductCard key={p.id} product={p} language={language} />
            ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={44} />
          <h2>{t("emptyWishlist")}</h2>
          <Button asChild>
            <ShopLink language={language} path="catalog">
              {t("catalogCta")}
            </ShopLink>
          </Button>
        </div>
      )}
    </div>
  );
}
function Field({
  label,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input type={type} required={required} placeholder={placeholder} />
    </label>
  );
}
function Checkout({ language }: { language: Language }) {
  const { t } = useTranslation();
  const { cart } = useStore();
  const [method, setMethod] = useState("courier");
  const [payment, setPayment] = useState("bank");
  const [message, setMessage] = useState("");
  return (
    <div className="container page-space">
      <Breadcrumbs language={language}>{t("deliveryCheckout")}</Breadcrumbs>
      <div className="checkout-steps">
        <span>
          <Check />
          {t("cart")}
        </span>
        <span className="active">
          2 <span>{t("deliveryCheckout")}</span>
        </span>
        <span>
          3 <span>{t("confirmation")}</span>
        </span>
      </div>
      <h1>{t("deliveryCheckout")}</h1>
      <p className="notice">
        <ShieldCheck />
        {t("previewNotice")}
      </p>
      {cart.length ? (
        <form
          className="checkout-grid"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(t("paymentUnavailable"));
          }}
        >
          <div>
            <section className="checkout-section">
              <h2>01 / {t("contact")}</h2>
              <div className="form-grid">
                <Field label={t("fullName")} />
                <Field label={t("phone")} type="tel" placeholder="+373" />
                <Field label={t("email")} type="email" />
              </div>
            </section>
            <section className="checkout-section">
              <h2>02 / {t("deliveryMethod")}</h2>
              <div className="radio-options">
                {["courier", "post", "pickup"].map((m) => (
                  <label
                    className={method === m ? "radio-option selected" : "radio-option"}
                    key={m}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={m}
                      checked={method === m}
                      onChange={() => setMethod(m)}
                    />
                    <span>
                      <strong>{t(m)}</strong>
                      <small>{m === "pickup" ? "str. Carbunari 2, Chișinău" : t("delivery")}</small>
                    </span>
                    {m === "pickup" ? <MapPin /> : <Truck />}
                  </label>
                ))}
              </div>
              {method !== "pickup" && (
                <div className="form-grid">
                  <label className="form-field">
                    <span>{t("city")}</span>
                    <select required defaultValue="">
                      <option value="" disabled>
                        {t("city")}
                      </option>
                      {["Chișinău", "Bălți", "Cahul", "Orhei", "Ungheni", "Comrat", "Soroca"].map(
                        (c) => (
                          <option key={c}>{c}</option>
                        ),
                      )}
                      <option>{t("otherCity")}</option>
                    </select>
                  </label>
                  <Field label={t("street")} />
                  <Field label={t("comment")} required={false} />
                </div>
              )}
            </section>
            <section className="checkout-section">
              <h2>03 / {t("payment")}</h2>
              <div className="radio-options">
                {["bank", "cash"].map((m) => (
                  <label
                    className={payment === m ? "radio-option selected" : "radio-option"}
                    key={m}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === m}
                      onChange={() => setPayment(m)}
                    />
                    <span>
                      <strong>{t(m)}</strong>
                      {m === "bank" && <small>Visa · Mastercard · Apple Pay · Google Pay</small>}
                    </span>
                    <CreditCard />
                  </label>
                ))}
              </div>
              {payment === "bank" && <p className="form-note">{t("bankNote")}</p>}
            </section>
          </div>
          <aside className="checkout-summary">
            <h2>{t("orderSummary")}</h2>
            <CartItems language={language} />
            <div className="total-line">
              <span>{t("subtotal")}</span>
              <strong>
                {subtotal(cart)} {t("lei")}
              </strong>
            </div>
            <div className="total-line">
              <span>{t("deliveryLabel")}</span>
              <span>
                {subtotal(cart) >= 600 || method === "pickup" ? t("free") : t("calculated")}
              </span>
            </div>
            <div className="total-line final-total">
              <span>{t("total")}</span>
              <strong>
                {subtotal(cart)} {t("lei")}
              </strong>
            </div>
            <label className="check-row terms-check">
              <input type="checkbox" required />
              {t("agree")}
            </label>
            <Button className="w-full" size="lg" type="submit">
              {t("order")}
              <ArrowRight />
            </Button>
            {message && (
              <p className="form-note" role="status">
                {message}
              </p>
            )}
          </aside>
        </form>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={44} />
          <h2>{t("emptyCart")}</h2>
          <Button asChild>
            <ShopLink language={language} path="catalog">
              {t("catalogCta")}
            </ShopLink>
          </Button>
        </div>
      )}
    </div>
  );
}
function Account() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  return (
    <div className="container account-page">
      <div className="account-form">
        <UserRound size={34} />
        <p className="eyebrow">KIWI KIDS</p>
        <h1>{t("login")}</h1>
        <p>{t("loginCopy")}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(t("accountNotice"));
          }}
        >
          <Field label={t("email")} type="email" />
          <Field label={t("password")} type="password" />
          <Button type="submit" size="lg" className="w-full">
            {t("signIn")}
            <ArrowRight />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setMessage(t("accountNotice"))}
          >
            <Mail />
            {t("magic")}
          </Button>
        </form>
        <p className="notice">{message || t("accountNotice")}</p>
      </div>
    </div>
  );
}
function Admin() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("orders");
  return (
    <div className="container page-space">
      <p className="eyebrow">KIWI KIDS</p>
      <h1>{t("admin")}</h1>
      <p className="notice">{t("adminNotice")}</p>
      <div className="admin-metrics">
        <div>
          <LayoutDashboard />
          <span>{t("orders")}</span>
          <strong>0</strong>
        </div>
        <div>
          <CreditCard />
          <span>{t("revenue")}</span>
          <strong>0 {t("lei")}</strong>
        </div>
        <div>
          <Package />
          <span>{t("products")}</span>
          <strong>2</strong>
        </div>
      </div>
      <div className="product-tabs">
        {["orders", "products"].map((key) => (
          <Button
            key={key}
            variant={tab === key ? "default" : "outline"}
            onClick={() => setTab(key)}
          >
            {t(key)}
          </Button>
        ))}
      </div>
      {tab === "orders" ? (
        <div className="empty-state">
          <Package size={36} />
          <h2>{t("noOrders")}</h2>
        </div>
      ) : (
        <div className="admin-products">
          {products.map((p) => (
            <div key={p.id}>
              <img src={p.image} alt={t(p.nameKey)} />
              <strong>{t(p.nameKey)}</strong>
              <span>{p.sku}</span>
              <strong>
                {p.price} {t("lei")}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function HelpPage({ path }: { path: string }) {
  const { t } = useTranslation();
  const slug = path.split("/")[1];
  const key =
    slug === "delivery"
      ? "deliveryPayment"
      : slug === "returns"
        ? "returnHelp"
        : slug === "sizes"
          ? "sizeGuide"
          : slug === "privacy"
            ? "privacy"
            : "terms";
  return (
    <div className="container help-page">
      <p className="eyebrow">KIWI KIDS</p>
      <h1>{t(key)}</h1>
      <p>
        {t(
          slug === "delivery"
            ? "deliveryText"
            : slug === "returns"
              ? "returnsText"
              : slug === "sizes"
                ? "sizePreview"
                : "legalText",
        )}
      </p>
      <a className="contact-link" href="tel:+37360789455">
        <Phone size={18} />
        +373 60 789 455
      </a>
    </div>
  );
}
function Newsletter() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  return (
    <section className="newsletter-section">
      <div className="container newsletter-inner">
        <div>
          <span className="eyebrow">{t("club")}</span>
          <h2>{t("newsletter")}</h2>
          <p>{t("newsletterCopy")}</p>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMessage(t("frontendNewsletter"));
            }}
          >
            <input type="email" required placeholder={t("email")} aria-label={t("email")} />
            <Button type="submit">
              {t("subscribe")}
              <ArrowUpRight />
            </Button>
          </form>
          <p className="newsletter-note" role="status">
            {message || t("newsletterNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
function Footer({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <ShopLink language={language} className="logo footer-logo">
              <span>
                kiwi<span className="logo-dot">.</span>
              </span>
              <span className="logo-caption">
                KIDS
                <br />
                ACTIVEWEAR
              </span>
            </ShopLink>
            <p>{t("footerCopy")}</p>
            <a
              className="instagram"
              href="https://www.instagram.com/kiwikids.activewear"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={19} />
              kiwikids.activewear
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div>
            <h3>{t("shop")}</h3>
            {["girls", "boys", "performance", "new", "sale"].map((key) => (
              <ShopLink
                key={key}
                language={language}
                path={
                  key === "performance"
                    ? "catalog/performance"
                    : key === "girls" || key === "boys"
                      ? `catalog?gender=${key}`
                      : key === "sale"
                        ? "catalog?sale=1"
                        : "catalog"
                }
              >
                {t(key)}
              </ShopLink>
            ))}
          </div>
          <div>
            <h3>{t("help")}</h3>
            {[
              ["delivery", "deliveryPayment"],
              ["returns", "returnHelp"],
              ["sizes", "sizeGuide"],
              ["terms", "terms"],
              ["privacy", "privacy"],
            ].map(([slug, key]) => (
              <ShopLink key={slug} language={language} path={`help/${slug}`}>
                {t(key ?? "help")}
              </ShopLink>
            ))}
          </div>
          <div>
            <h3>{t("contact")}</h3>
            <a href="tel:+37360789455">+373 60 789 455</a>
            <span>str. Carbunari 2, Chișinău</span>
            <span>{t("hours")}</span>
            <div className="payment-logos">
              <strong>VISA</strong>
              <span className="mastercard">
                <span />
                <span />
              </span>
              <span>Apple Pay</span>
              <span>G Pay</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t("copyright")}</span>
          <span>{t("made")}</span>
        </div>
      </div>
    </footer>
  );
}
