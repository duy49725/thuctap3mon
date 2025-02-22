import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./page/admin-view/dashboard";
import AdminCategoryPage from "./page/admin-view/categories";
import AdminFruitTypePage from "./page/admin-view/fruitType";
import AdminPromotionPage from "./page/admin-view/promotion";
import AdminProductPage from "./page/admin-view/product";
import Home from "./page/shopping-view/home";
import ShoppintLayout from "./components/shopping-view/layout";
import RegisterPage from "./page/auth-view/register-page";
import LoginPage from "./page/auth-view/login-page";
import AdminFeature from "./page/admin-view/feature";
import ShoppingListing from "./page/shopping-view/listing";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { checkAuth } from "./store/auth/auth-slice";
import { useEffect } from "react";


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.adminAuth);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/admin" element={<AdminLayout />}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="category" element={<AdminCategoryPage />} />
          <Route path="fruitType" element={<AdminFruitTypePage />} />
          <Route path="promotion" element={<AdminPromotionPage />} />
          <Route path="product" element={<AdminProductPage />} />
          <Route path="feature" element={<AdminFeature />} />
        </Route>
        <Route path="/shopping" element={<ShoppintLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="list" element={<ShoppingListing />} />
        </Route>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App;
