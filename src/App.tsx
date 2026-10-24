import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { I18nProvider } from "@/i18n"
import { AuthProvider } from "@/hooks/useAuth"
import { MainLayout } from "@/layouts/MainLayout"
import { HomePage } from "@/pages/HomePage"
import { ServerPage } from "@/pages/ServerPage"
import { RankingsPage } from "@/pages/RankingsPage"
import { WikiPage } from "@/pages/WikiPage"
import { RulesPage } from "@/pages/RulesPage"
import { NewsPage } from "@/pages/NewsPage"
import { NewsArticlePage } from "@/pages/NewsArticlePage"
import { PlayerPage } from "@/pages/PlayerPage"
import { ShopPage } from "@/pages/ShopPage"
import { EconomyPage } from "@/pages/EconomyPage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { ProfilePage } from "@/pages/auth/ProfilePage"
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage"
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage"
import { AdminLayout } from "@/pages/admin/AdminLayout"
import { AdminDashboard } from "@/pages/admin/AdminDashboard"
import { AdminPlayers } from "@/pages/admin/AdminPlayers"
import { AdminNews } from "@/pages/admin/AdminNews"
import { AdminShop } from "@/pages/admin/AdminShop"
import { AdminWiki } from "@/pages/admin/AdminWiki"
import { AdminSettings } from "@/pages/admin/AdminSettings"
import { AdminReports } from "@/pages/admin/AdminReports"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { TermsPage } from "@/pages/TermsPage"
import { PrivacyPage } from "@/pages/PrivacyPage"
import { ReportPage } from "@/pages/ReportPage"
import { DevIndicator } from "@/components/DevIndicator"
import { MaintenanceGate } from "@/components/MaintenanceGate"
import { ScrollToTop } from "@/components/ScrollToTop"
import { Seo } from "@/components/Seo"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <MaintenanceGate>
            <ScrollToTop />
            <Seo />
            <ErrorBoundary>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="server" element={<ServerPage />} />
                <Route path="rankings" element={<RankingsPage />} />
                <Route path="wiki" element={<WikiPage />} />
                <Route path="wiki/:slug" element={<WikiPage />} />
                <Route path="rules" element={<RulesPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="news/:slug" element={<NewsArticlePage />} />
                <Route path="player/:username" element={<PlayerPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="economy" element={<EconomyPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="report" element={<ReportPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin — separate layout, protected */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="players" element={<AdminPlayers />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="wiki" element={<AdminWiki />} />
                <Route path="shop" element={<AdminShop />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
            </ErrorBoundary>
            </MaintenanceGate>
          </BrowserRouter>
          <DevIndicator />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              },
            }}
          />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
