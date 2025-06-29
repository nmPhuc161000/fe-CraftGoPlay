// src/App.jsx
import "./index.css";
import AppRouter from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
