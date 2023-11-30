import React, { useState, useEffect } from "react";
import { LoginPage } from "./Pages/Homepage/LoginPage";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ROUTE_PATH } from "./Pages/GlobalFunctions/routePath";
import { AdminDashboard } from "./Pages/Admin/Pages/AdminDashboard";
import { AdminLogin } from "./Pages/Admin/Pages/AdminLogin";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { DraweComponent } from "./Pages/Homepage/DrawerComponent";
import { CreateAccount } from "./Pages/Homepage/CreateAccount";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  const theme = createTheme();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path={ROUTE_PATH.HOME_PAGE} element={<LoginPage />} />
        <Route path={ROUTE_PATH.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTE_PATH.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route path={ROUTE_PATH.DASHBOARD} element={<DraweComponent />} />
        <Route path={ROUTE_PATH.DASHBOARD_ID} element={<DraweComponent />} />
        <Route path={ROUTE_PATH.CREATE_ACCOUNT} element={<CreateAccount />} />
      </>
    )
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <RouterProvider router={router} />
          </StyledEngineProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
