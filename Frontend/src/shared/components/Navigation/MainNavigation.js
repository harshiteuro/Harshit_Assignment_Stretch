import React,{useState} from 'react';
import { Link } from 'react-router-dom';

import Backdrop from '../UIElements/Backdrop';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import './MainNavigation.css';
import SideDrawer from './SideDrawer';
const MainNavigation = props => {
  const [drawerIsOpen,setDrawerIsOpen]=useState(false);

  const openDrawerHandler=()=>{
    setDrawerIsOpen(true);
  }
  const closeDrawerHandler=()=>{
    setDrawerIsOpen(false);
  }
  return (
    <>
    {drawerIsOpen && <Backdrop onClick={closeDrawerHandler}></Backdrop>}
   
    <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className='main-navigation__drawer-nav'>
            <NavLinks></NavLinks>
        </nav>
    </SideDrawer>)
    
    <MainHeader>
      <button onClick={openDrawerHandler} className="main-navigation__menu-btn">
        <span />
        <span />
        <span />
      </button>
      <h1 className="main-navigation__title">
        <Link to="/">ADD PROFILE</Link>
      </h1>
      <nav className='main-navigation__header-nav'>
        <NavLinks />
      </nav>
    </MainHeader>
    </>
  );
};

export default MainNavigation;
