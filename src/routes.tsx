import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isLanguage } from "@/lib/store/translations";
import { Storefront } from "@/components/store/storefront";
import { storeHead } from "@/lib/store/metadata";
import { useDocumentHead } from "@/lib/use-document-head";

export function Index() {
  const navigate = useNavigate();
  useDocumentHead(storeHead("ro"));
  useEffect(() => {
    const lang = localStorage.getItem("kiwi-language");
    if (lang && isLanguage(lang) && lang !== "ro") navigate(`/${lang}`, { replace: true });
  }, [navigate]);
  return <Storefront language="ro" />;
}

export function LocalizedHome() {
  const { lang = "ro" } = useParams();
  useDocumentHead(storeHead(lang));
  return <Storefront language={lang} />;
}

export function LocalizedPage() {
  const { lang = "ro", "*": splat = "" } = useParams();
  useDocumentHead(storeHead(lang, splat));
  return <Storefront language={lang} path={splat} />;
}
