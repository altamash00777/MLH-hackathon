import { BrowserRouter, Routes, Route } from "react-router-dom";

import FarmerRegister from "./pages/auth/FarmerRegister";
import FarmerLogin from "./pages/auth/FarmerLogin";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AddCrop from "./pages/farmer/AddCrop";
import MyCrops from "./pages/farmer/MyCrops";
import EditCrop from "./pages/farmer/EditCrop";
import ProtectedRoute from "./components/ProtectedRoute";


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

      </Routes>

    </BrowserRouter>
  );
}

export default App;