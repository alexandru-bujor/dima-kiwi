import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/error-boundary";
import { NotFound } from "@/components/not-found";
import { StoreProvider } from "@/lib/store/context";
import { Index, LocalizedHome, LocalizedPage } from "@/routes";

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:lang" element={<LocalizedHome />} />
            <Route path="/:lang/*" element={<LocalizedPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ErrorBoundary>
  );
}
