import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { RequireAuth } from "./components/RequireAuth";
import { HomePage } from "./pages/HomePage";
import { AccountPage } from "./pages/AccountPage";
import { ForumPage } from "./pages/ForumPage";
import { SubforumPage } from "./pages/SubforumPage";
import { ThreadPage } from "./pages/ThreadPage";
import { ShopPage } from "./pages/ShopPage";
import { ReportsPage } from "./pages/ReportsPage";
import { AdminPage } from "./pages/AdminPage";
import { OwnerPermissionsPage } from "./pages/OwnerPermissionsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="cuenta" element={<AccountPage />} />
        <Route path="foro" element={<ForumPage />} />
        <Route path="foro/:categorySlug/:subSlug" element={<SubforumPage />} />
        <Route path="foro/hilo/:threadId" element={<ThreadPage />} />
        <Route path="tienda" element={<ShopPage />} />
        <Route
          path="reportes"
          element={
            <RequireAuth>
              <ReportsPage />
            </RequireAuth>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route
          path="owner/permisos"
          element={
            <RequireAuth>
              <OwnerPermissionsPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}