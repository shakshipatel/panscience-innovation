import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "./store";

import RoleRoutes from "./rbac/RoleRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: "16px" },
          }}
        />
        <RoleRoutes />
      </Provider>
    </BrowserRouter>
  );
};

export default App;
