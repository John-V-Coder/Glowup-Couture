import React from 'react';
import './preloader.css';
import { BrandLogo } from '../shopping-view/header';

const Preloader = ({ message = "" }) => {
  return (
    <div className="preloader-container">
      <div className="preloader-content">
        <div className="logo-spinner-wrapper">
          <BrandLogo />
          <div className="gold-spinner">
            <div className="spinner-ring"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;