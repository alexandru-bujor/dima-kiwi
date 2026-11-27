import { useEffect } from "react";

type MetaTag = { title?: string; name?: string; property?: string; content?: string };
type LinkTag = { rel: string; hrefLang?: string; href: string };
export type DocumentHead = { meta: MetaTag[]; links?: LinkTag[] };

// No SSR in this app, so per-route <head> tags are applied client-side after mount
// instead of being rendered into the initial response.
export function useDocumentHead(head: DocumentHead) {
  useEffect(() => {
    const titleTag = head.meta.find((m) => m.title !== undefined);
    const previousTitle = document.title;
    if (titleTag?.title) document.title = titleTag.title;

    const managedMetaEls: HTMLMetaElement[] = [];
    for (const m of head.meta) {
      if (m.title !== undefined || m.content === undefined) continue;
      const selector = m.name
        ? `meta[name="${m.name}"]`
        : m.property
          ? `meta[property="${m.property}"]`
          : null;
      if (!selector) continue;
      const el = document.createElement("meta");
      if (m.name) el.setAttribute("name", m.name);
      if (m.property) el.setAttribute("property", m.property);
      el.setAttribute("content", m.content);
      el.setAttribute("data-head-managed", "");
      document.head.appendChild(el);
      managedMetaEls.push(el);
    }

    const managedLinkEls: HTMLLinkElement[] = [];
    for (const l of head.links ?? []) {
      const el = document.createElement("link");
      el.setAttribute("rel", l.rel);
      if (l.hrefLang) el.setAttribute("hreflang", l.hrefLang);
      el.setAttribute("href", l.href);
      el.setAttribute("data-head-managed", "");
      document.head.appendChild(el);
      managedLinkEls.push(el);
    }

    return () => {
      document.title = previousTitle;
      for (const el of managedMetaEls) el.remove();
      for (const el of managedLinkEls) el.remove();
    };
  }, [head]);
}
