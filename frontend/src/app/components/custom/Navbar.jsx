import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import AuthProvider from '@/app/providers/AuthProvider'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/app/components/ui/dropdown-menu"

import { Divide as Hamburger } from 'hamburger-react'
import { BsSearch, BsChat } from "react-icons/bs";

const Links = [
    { name: "Login", path: "/login", auth: false},
    { name: "Join Now", path: "/signup", auth: false, styleProps: "bg-[#ed7839] hover:bg-[#ed6218] text-white font-medium rounded-lg px-5 py-4"},

    { icon: <BsSearch size={22} color="black" />, name: "Search", path: "/job-listings", auth: true },
    { icon: <BsChat size={22} color="black"/>, name: "Inbox", path: "/chat", auth: true },

    { name: "Log Out", path: "/logout", auth: true, styleProps: "bg-[#ed7839] hover:bg-[#ed6218] text-white font-medium rounded-lg px-5 py-4" },
]

const LinksConnectedWithLogo = [
    { name: "About", path: "/about"},
    { name: "Contact", path: "/contact"},
]

const Navbar = () => {
    const {userAuthData} = useContext(AuthProvider);    

    return (
        <section className="max-w-screen-lg px-2 md:px-8 mx-auto backdrop-blur-xl bg-[#ffffff90] mb-10 mt-12">
            <nav className="w-full flex items-center justify-between">
                
                <ul className="flex flex-row items-center gap-2 ml-5">

                    <Link to="/">
                        <div className="flex flex-col items-left text-[42px] text-left w-[140px] -mt-2">
                            <h1 className="font-medium bg-gradient-to-r from-[#fd7f30] via-[#fc6c33e3] to-[#fa5838] inline-block text-transparent bg-clip-text">Sunrise</h1>

                            <div className="flex items-center -mt-2">
                                <hr className="w-full border-t border-black"/>
                                <span className="text-xs font-medium text-black mx-1">Senior</span>
                                <span className="text-xs font-medium text-black">Services</span>
                            </div>
                        </div>  
                    </Link>

                    <ul className="flex flex-row items-center gap-1 ml-1 max-md:hidden">
                        {LinksConnectedWithLogo.map((link, index) => {
                            return (
                                <li key={link.path}>
                                    {link.styleProps ?  
                                        <Link className={link.styleProps} to={link.path}>{link.name}</Link> 
                                    :
                                        <Link className="leading-normal tracking-tight transition-all text-[16px] text-[#434958] cursor-pointer font-medium text-opacity-60 hover:text-opacity-90 hover:bg-[#ff846575] hover:backdrop-blur-[40px] hover:rounded-lg px-6 py-3" to={link.path}>{link.name}</Link>
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </ul>

                <ul className="flex-1 md:flex justify-end items-center gap-6 hidden">
                    {Links.map((link, index) => {
                        const showLink = (link.auth && userAuthData && userAuthData.isConnected) || (!link.auth && (!userAuthData || !userAuthData.isConnected));

                        return showLink ? (
                            <li key={link.path}>
                                {link.icon ? 
                                    <Link to={link.path} className="flex flex-col items-center gap-2 mt-1">
                                        <span className="text-2xl">{link.icon}</span>
                                        <span className="text-sm">{link.name}</span>
                                    </Link>
                                :
                                    link.styleProps ?
                                        <Link className={link.styleProps} to={link.path}>{link.name}</Link>
                                    :
                                        <Link className="leading-normal tracking-tight transition-all text-[16px] text-[#434958] cursor-pointer font-medium text-opacity-60 hover:text-opacity-90 hover:bg-[#ff846575] hover:backdrop-blur-[40px] hover:rounded-lg px-6 py-3" to={link.path}>{link.name}</Link>
                                }
                            </li>
                        ) : null;
                    })}
                </ul>

                <DropdownMenu>
                    <DropdownMenuTrigger className="md:hidden max-md:block max-md:mr-5"><Hamburger hideOutline={true} rounded distance="lg" size={35}/></DropdownMenuTrigger>
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

export default Navbar;