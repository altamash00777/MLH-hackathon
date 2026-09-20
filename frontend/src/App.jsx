import { BrowserRouter, Routes, Route } from "react-router-dom";

import FarmerRegister from "./pages/auth/FarmerRegister";
import FarmerLogin from "./pages/auth/FarmerLogin";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AddCrop from "./pages/farmer/AddCrop";
import MyCrops from "./pages/farmer/MyCrops";
import EditCrop from "./pages/farmer/EditCrop";
import ProtectedRoute from "./components/ProtectedRoute";
import MyMatches from "./pages/farmer/MyMatches";
import BuyerRegister from "./pages/buyer/BuyerRegister";
import BuyerLogin from "./pages/buyer/BuyerLogin";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import AddRequirement from "./pages/buyer/AddRequirement";
import MyRequirements from "./pages/buyer/MyRequirements";
import EditRequirement from "./pages/buyer/EditRequirement";
import BuyerMatches from "./pages/buyer/BuyerMatches";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerNotifications from "./pages/farmer/FarmerNotifications";
import AIPricePrediction from "./pages/farmer/AIPricePrediction";
import Bidding from "./pages/farmer/Bidding";
import FPO from "./pages/farmer/FPO";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
<BrowserRouter>

      <Routes>

        <Route
          path="/farmer/register"
          element={<FarmerRegister />}
        />

        <Route
          path="/farmer/login"
          element={<FarmerLogin />}
        />


<Route
  path="/farmer/dashboard"
  element={
    <ProtectedRoute role="farmer">
      <FarmerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/farmer/add-crop"
  element={
    <ProtectedRoute role="farmer">
      <AddCrop />
    </ProtectedRoute>
  }
/>

<Route
  path="/farmer/crops"
  element={
    <ProtectedRoute role="farmer">
      <MyCrops />
    </ProtectedRoute>
  }
/>

<Route
  path="/farmer/crops/edit/:id"
  element={
    <ProtectedRoute role="farmer">
      <EditCrop />
    </ProtectedRoute>
  }
/>

<Route
  path="/farmer/matches"
  element={
    <ProtectedRoute role="farmer">
      <MyMatches />
    </ProtectedRoute>
  }
/>
<Route
  path="/buyer/register"
  element={<BuyerRegister />}
/>
<Route
  path="/buyer/login"
  element={<BuyerLogin />}
/>

<Route
  path="/buyer/dashboard"
  element={<BuyerDashboard />}
/>

<Route
  path="/buyer/add-requirement"
  element={<AddRequirement />}
/>
<Route
  path="/buyer/requirements"
  element={<MyRequirements />}
/>
<Route
  path="/buyer/edit-requirement/:id"
  element={<EditRequirement />}
/>
<Route
  path="/buyer/matches"
  element={<BuyerMatches />}
/>

<Route
  path="/farmer/profile"
  element={<FarmerProfile />}
/>

<Route
  path="/farmer/notifications"
  element={<FarmerNotifications />}
/>
<Route
  path="/farmer/ai-price-prediction"
  element={
    <ProtectedRoute role="farmer">
      <AIPricePrediction />
    </ProtectedRoute>
  }
/>
<Route
  path="/farmer/bidding"
  element={
    <ProtectedRoute role="farmer">
      <Bidding />
    </ProtectedRoute>
  }
/>
<Route path="/farmer/fpo" element={<FPO />} />


<Route path="/Landing" element={<LandingPage />} />

<Route path="*" element={<NotFound />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;