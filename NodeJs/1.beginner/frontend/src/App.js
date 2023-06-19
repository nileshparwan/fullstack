import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import 'mapbox-gl/dist/mapbox-gl.css';
import LoadingSpinner from './shared/components/UiElement/LoadingSpinner';

// code splitting into meaningful chunks
const User = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

function App() {
  let routes;
  const { userId, token, login, logout } = useAuth();

  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" element={<User />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route
          // index                                    // <-- "/" or path="*"
          element={<div>Default Page Content</div>}
        />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" element={<User />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          // index                                    // <-- "/" or path="*"
          path="*"
          element={<div>Default Page Content</div>}
        />
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login,
      logout
    }}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={
            <div className='center'>
              <LoadingSpinner />
            </div>
          }>
            <Routes>
              {routes}
            </Routes>
          </Suspense>
           
          {/* <Route
              path="*"
              Component={
                <main>
                  <p>There's nothing here!</p>
                </main>
              }
            />  */}
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
