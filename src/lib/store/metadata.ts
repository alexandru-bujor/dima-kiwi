import { copy, isLanguage } from "./translations";
import { categories } from "./data";
export function storeHead(language = "ro", path = "") {
  const lang = isLanguage(language) ? language : "ro";
  const section = path.split("/")[0] ?? "";
  const category = categories.find((c) => c.slug === path.split("/")[1]);
  const title =
    section === "catalog"
      ? copy(lang, category?.key ?? "catalog")
      : section === "product"
        ? copy(lang, path.includes("longsleeve") ? "sleeveName" : "topName")
        : section === "cart"
          ? copy(lang, "cart")
          : section === "checkout"
            ? copy(lang, "deliveryCheckout")
            : section === "account"
              ? copy(lang, "account")
              : section === "wishlist"
                ? copy(lang, "wishlist")
                : section === "admin"
                  ? copy(lang, "admin")
                  : section === "help"
                    ? copy(
                        lang,
                        path.includes("delivery")
                          ? "deliveryPayment"
                          : path.includes("return")
                            ? "returnHelp"
                            : path.includes("size")
                              ? "sizeGuide"
                              : path.includes("privacy")
                                ? "privacy"
                                : "terms",
                      )
                    : copy(lang, "hero1");
  const fullTitle = `${title} | KiwiKids`;
  const description = copy(lang, "heroCopy");
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: section === "product" ? "product" : "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: ["ro", "ru", "en"].map((language) => ({
      rel: "alternate",
      hrefLang: language,
      href: `/${language}${path ? `/${path}` : ""}`,
    })),
  };
}
