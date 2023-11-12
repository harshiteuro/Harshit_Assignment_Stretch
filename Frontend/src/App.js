import React,{Suspense} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
  Navigate  
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const Users=React.lazy(()=>import('./user/pages/Users'));
const Auth=React.lazy(()=>import('./user/pages/Auth'));
const ViewProfile=React.lazy(()=>import('./user/pages/ViewProfile'))
const EditProfile=React.lazy(()=>import('./user/pages/EditProfile'))
const DeleteProfile=React.lazy(()=>import('./user/pages/DeleteProfile'))

const App = () => {
const {token,login,logout,userId} =useAuth();
  let routes;
  if(token){
    routes=(
      <Routes>
        <Route path="/:id/delete_profile" exact element={<DeleteProfile></DeleteProfile>}></Route>
        <Route path="/:id/view_profile" exact element={<ViewProfile></ViewProfile>}></Route>
        <Route path="/:id/edit_profile" element={<EditProfile></EditProfile>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" exact element={<Users></Users>}></Route>
      </Routes>
    );
  }
  else{
    routes=(
      <Routes>
      <Route path="/" exact element={<Users></Users>}></Route>
      <Route path='/auth' exact element={<Auth></Auth>}></Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider value={{isLoggedIn:!!token,token:token,userId:userId,login:login,logout:logout}}>
    <Router>
      <MainNavigation />
      <main>
      <Suspense fallback={<div className='center'><LoadingSpinner></LoadingSpinner></div>}>
      {routes};
      </Suspense>
      </main>
    </Router>
    </AuthContext.Provider>
  );
};

export default App;
