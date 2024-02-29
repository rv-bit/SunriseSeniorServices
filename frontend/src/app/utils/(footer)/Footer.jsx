import './Footer.css';

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <section className="xl:mt mt-20 border-t-[1px] bg-[#02073A] border-[#7D2CDC]">
      <div className="xl:max-w-screen-xl mx-auto pb-[50px]">
        
        <div className="my-[80px]">
          <h1 className="text-[#7D2CDC] text-[24px] font-bold text-center">Footer</h1>
          <p className="text-[#7D2CDC] text-[16px] font-medium text-center">This is the footer.</p>

          <div className="flex-1 md:flex grid justify-center items-center gap-10 mt-5">
            <Link to="/about" className="text-[#7D2CDC] text-[16px] font-medium text-center">About</Link>
            <Link to="/contact" className="text-[#7D2CDC] text-[16px] font-medium text-center">Contact</Link>
            <Link to="/" className="text-[#7D2CDC] text-[16px] font-medium text-center">Home</Link>
          </div>
        </div>

        <div className="opacity-50"><hr/></div>

        <div className="flex align-middle justify-center mt-4 mb-[-10px]">
          <p className="text-[#7D2CDC] text-[16px] font-medium text-center">© 2024 Company, Inc.</p>
        </div>
      </div>
    </section>
  )
}