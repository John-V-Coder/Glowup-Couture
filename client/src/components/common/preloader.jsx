import React from 'react';
import './preloader.css';
import { BrandLogo } from '../shopping-view/header';

const Preloader = ({ message = "Loading the latest trends..." }) => {
  return (
    <div className="preloader-container">
      <div className="preloader-content">
        <BrandLogo />
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="preloader-message">{message}</p>
      </div>
    </div>
  );
};

export default Preloader;