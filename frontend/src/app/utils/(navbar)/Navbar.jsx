import './Navbar.css';

import { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

import { AuthContext } from '../index'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

export const Navbar = () => {
    const {userAuthData} = useContext(AuthContext);    

    const Links = [
        { name: "Login", path: "/login", auth: false},
        { name: "Join Now", path: "/signup", auth: false, styleProps: "bg-[#7F56D9] text-white font-medium rounded-lg px-5 py-4"},

        { name: "Inbox", path: "/chat", auth: true },
        { name: "Log Out", path: "/logout", auth: true, styleProps: "bg-[#7F56D9] text-white font-medium rounded-lg px-5 py-4" },
    ]

    const LinksConnectedWithLogo = [
        { name: "About", path: "/about"},
        { name: "Contact", path: "/contact"},
    ]
    
    return (
        <section className="max-w-screen-lg px-2 md:px-8 mx-auto sticky top-0 backdrop-blur-xl bg-[#ffffff90] z-50 mb-10 mt-12">
            <nav className="w-full flex items-center justify-between">
                <div className="flex flex-row items-center">

                    <Link to="/">
                        <div className="text-[25px] text-left mb-[5px] px-5 py-4">
                            Sunrise
                            <span className="font-medium text-[#7F56D9]">Services</span>
                        </div>
                    </Link>

                    <ul className = "flex-1 flex flex-row justify-end items-center gap-5 ml-3 max-md:hidden">
                        {LinksConnectedWithLogo.map((link, index) => {
                            return (
                                <li key={link.path}>
                                    {link.styleProps ?  
                                        <Link className={link.styleProps} to={link.path}>{link.name}</Link> 
                                    :
                                        <Link className="leading-normal tracking-tight transition-all text-[16px] text-[#434958] cursor-pointer font-medium text-opacity-60 hover:text-opacity-90 hover:bg-[#7F56D905] hover:backdrop-blur-[40px] hover:rounded-lg px-3 py-2" to={link.path}>{link.name}</Link>
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <ul className="flex-1 md:flex justify-end items-center gap-5 hidden">
                    {Links.map((link, index) => {
                        const showLink = (link.auth && userAuthData && userAuthData.isConnected) || (!link.auth && (!userAuthData || !userAuthData.isConnected));

                        return showLink ? (
                            <li key={link.path}>
                                {link.styleProps ?  
                                    <Link className={link.styleProps} to={link.path}>{link.name}</Link> 
                                :
                                    <Link className="leading-normal tracking-tight transition-all text-[16px] text-[#434958] cursor-pointer font-medium text-opacity-60 hover:text-opacity-90 hover:bg-[#7F56D905] hover:backdrop-blur-[40px] hover:rounded-lg px-3 py-2" to={link.path}>{link.name}</Link>
                                }
                            </li>
                        ) : null;
                    })}
                </ul>

                <DropdownMenu>
                    <DropdownMenuTrigger className="md:hidden max-md:block tracking-tight bg-[#7F56D9] text-white font-medium rounded-lg px-10 py-3 mr-5">Menu</DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-6">
                        {LinksConnectedWithLogo.map((link, index) => {
                            return (
                                <DropdownMenuGroup key={link.path}>
                                    <DropdownMenuItem key={link.path} asChild>
                                        <Link to={link.path} className="w-full h-full">
                                            <DropdownMenuLabel className="w-full h-full text-left">
                                                {link.name}
                                            </DropdownMenuLabel>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                </DropdownMenuGroup>
                            );
                        })}

                        {Links.filter(link => 
                            (link.auth && userAuthData && userAuthData.isConnected) || 
                            (!link.auth && (!userAuthData || !userAuthData.isConnected))
                        ).map((link, index, filteredLinks) => {
                            return (
                                <DropdownMenuGroup key={link.path}>
                                    <DropdownMenuItem key={link.path} asChild>
                                        <Link to={link.path} className="w-full h-full">
                                            <DropdownMenuLabel className="w-full h-full text-left">
                                                {link.name}
                                            </DropdownMenuLabel>
                                        </Link>
                                    </DropdownMenuItem>

                                    {index < filteredLinks.length - 1 && <DropdownMenuSeparator />}
                                </DropdownMenuGroup>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </section>
    );
}