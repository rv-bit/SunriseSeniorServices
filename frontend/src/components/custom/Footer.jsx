import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import PagesData from "@/data/PagesData";

const Footer = () => {
    return (
        <section className="mt-auto bg-[#f8f8f9] border-t-[1px] border-[#49494920]">
            <div className="container mx-auto pb-12">

                <div className="my-20">
                    <div className="flex flex-row max-sm:flex-col justify-center items-center gap-10 mt-5">
                        <Link to="/about" className="text-base font-medium text-center">About</Link>
                        <Link to="/contact" className="text-base font-medium text-center">Contact</Link>
                        <Link to="/" className="text-base font-medium text-center">Home</Link>
                    </div>
                </div>

                <hr className="border-[#4949499e] opacity-50" />

                <div className="flex flex-col align-middle justify-center mt-4 mb-[-10px] gap-5">
                    <h1 className="text-center text-sm">{PagesData.About.what_we_do_all}</h1>

                    <p className="text-base font-medium text-center underline">
                        <Link to="https://www.wlv.ac.uk/">
                            © 2024 Company, Inc.
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Footer;