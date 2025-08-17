import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "@/components/pages/LoginPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FileUploadPageWithHeader from "@/components/pages/FileUploadPageWithHeader";
import React from "react";
import FileUploadPage from "@/components/pages/FileUploadPage";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <FileUploadPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
);
}

export default App;