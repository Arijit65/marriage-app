import React from "react"
import MarriagePaperWebsite from "./pages/Home"
import { Route, Routes } from "react-router-dom";
import Home2 from "./pages/Home2";
import About from "./pages/About ";
import BenefitsSection from "./pages/Benefits";
import PlansSection from "./pages/Pricings";
import ProfilesPage from "./pages/Profiles";
import Workflow from "./pages/Workflow";
import Proposal from "./pages/Proposal";
import YetToMarry from "./pages/YetToMarry";
import Announcement from "./pages/Announcement";
import Register from "./pages/Auth/Register";
import AdminAuth from "./pages/Auth/AdminAuth";
import RRAuth from "./pages/Auth/RRAuth";
import PortalLanding from "./pages/Auth/PortalLanding";
import { AppProviders } from "./context/index";
import IndividualProfilePage from "./pages/Profile/Profile";
import AdminDashboard from "./pages/Admin/AdminPanel";
import RRDashboard from "./pages/Admin/RRPanel";
import ProtectedRoute from "./pages/Routes/ProtectedRoutes";
import PaymentCheckout from "./Components/PaymentCheckout";
import Dashboard from "./pages/Profile/Dashboard";
import EditAd from "./pages/Profile/EditAd";
import BlogPage from "./pages/Blog/Blog";
import PostRegistrationMessage from "./pages/Auth/PostRegistrationMessage";

function App() {

  return (
    <AppProviders>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home2 />} />
        <Route path="/about" element={<About />} />
        <Route path="/benefit" element={<BenefitsSection />} />
        <Route path="/plans" element={<PlansSection />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/profile/:id" element={<IndividualProfilePage />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/yet-to-marry" element={<YetToMarry />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-reg/:id" element={<PostRegistrationMessage/>}/>
        <Route path="/register/:referCode" element={<Register />} />
        <Route path="/portals" element={<PortalLanding />} />
        <Route path="/blogs" element={<BlogPage />} />
        
        {/* Protected Profile Routes */}
        <Route path="/checkout" element={  <PaymentCheckout /> } />
        <Route path="/dashboard" element={
            <Dashboard />
        } />
        <Route path="/edit-ad" element={
          <ProtectedRoute>
            <EditAd />
          </ProtectedRoute>
        } />
        
        {/* Auth Routes */}
     
        <Route path="/admin-login" element={<AdminAuth />} />
        <Route path="/rr-login" element={<RRAuth />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin-panel" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected RR Routes */}
        <Route path="/rr-panel" element={
          <ProtectedRoute requiredRole="rr">
            <RRDashboard />
          </ProtectedRoute>
        } />
        
        {/* Legacy Routes - Redirect to new ones */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/rr" element={
          <ProtectedRoute requiredRole="rr">
            <RRDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </AppProviders>
  )
}

export default App
