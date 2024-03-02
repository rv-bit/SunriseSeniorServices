import './Footer.css';

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <section className="mt-auto bg-[#02073A] border-t-[1px] border-[#7D2CDC]">
      <div className="container mx-auto pb-12">

        <div className="my-20">
          <h1 className="text-[#7D2CDC] text-2xl font-bold text-center">Footer</h1>
          <p className="text-[#7D2CDC] text-base font-medium text-center">This is the footer.</p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-5">
            <Link to="/about" className="text-[#7D2CDC] text-base font-medium text-center">About</Link>
            <Link to="/contact" className="text-[#7D2CDC] text-base font-medium text-center">Contact</Link>
            <Link to="/" className="text-[#7D2CDC] text-base font-medium text-center">Home</Link>
          </div>
        </div>

        <div className="opacity-50"><hr/></div>

        <div className="flex align-middle justify-center mt-4 mb-[-10px]">
          <p className="text-[#7D2CDC] text-base font-medium text-center">© 2024 Company, Inc.</p>
        </div>
      </div>
    </section>
  )
}