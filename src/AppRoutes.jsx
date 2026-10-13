import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";

const Home = lazy(() => import("./pages/home"));
const Appointments = lazy(() => import("./pages/appointments"));
const HealthRecords = lazy(() => import("./pages/healthRecords"));
const NotFound = lazy(() => import("./pages/notFound"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
};

const AppRoutes = (props) => {
  const location = useLocation();
  return <>
    <ScrollToTop />
    <Suspense key={location.pathname} fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home {...props} />} />
        <Route path="/appointments" element={<Appointments key={location.search} {...props} />} />
        <Route path="/health-records" element={<HealthRecords {...props} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>;
};

export default AppRoutes;
