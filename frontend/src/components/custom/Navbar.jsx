import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import useUserAuth from "@/hooks/useUserAuth";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

import { MessageSquare, Search, Menu } from "lucide-react"
import { Button } from "antd";

const Links = [
    { name: "Login", path: "/login", auth: false },
    { name: "Join Now", path: "/signup", auth: false, styleProps: "bg-[#ed7839] hover:bg-[#ed6218] hover:cursor-pointer text-white font-medium rounded-lg px-5 py-4" },

    { icon: <Search size={22} color="black" />, name: "Search", path: "/job-listings", auth: true },
    { icon: <MessageSquare size={22} color="black" />, name: "Inbox", path: "/chat", auth: true },

    { name: "Account", path: "/account", auth: true },
]

const LinksConnectedWithLogo = [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
]

const Navbar = () => {
    const { isLoaded, isSignedIn, user } = useUserAuth();

    return (
        <section className="max-w-screen-lg px-2 md:px-8 mx-auto backdrop-blur-xl bg-[#ffffff90] mb-10 mt-12">
            <nav className="w-full flex items-center justify-between">

                <ul className="flex flex-row items-center gap-2 ml-5">

                    <Link to="/">
                        <div className="flex flex-col items-left text-[42px] text-left w-[140px] -mt-2">
                            <h1 className="font-medium bg-gradient-to-r from-[#fd7f30] via-[#fc6c33e3] to-[#fa5838] inline-block text-transparent bg-clip-text">Sunrise</h1>

                            <div className="flex items-center -mt-2">
                                <hr className="w-full border-t border-black" />
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
                        const showLink = (link.auth && isSignedIn) || (!link.auth && !isSignedIn);

                        return showLink ? (
                            <li key={link.path}>
                                {link.icon ?
                                    <Link to={link.path} className="flex flex-col items-center gap-2 mt-1">
                                        <span className="text-2xl">{link.icon}</span>
                                        <span className="text-sm">{link.name}</span>
                                    </Link>
                                    :

                                    link.component ?
                                        link.styleProps && link.component ?
                                            <div className={link.styleProps}><link.component /></div>
                                            :
                                            <div className="leading-normal tracking-tight transition-all text-[16px] text-[#434958] cursor-pointer font-medium text-opacity-60 hover:text-opacity-90 hover:bg-[#ff846575] hover:backdrop-blur-[40px] hover:rounded-lg px-6 py-3"><link.component /></div>
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
                    <DropdownMenuTrigger className="md:hidden max-md:block max-md:mr-5"><Menu size={35} /></DropdownMenuTrigger>
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
                            (link.auth && isSignedIn) ||
                            (!link.auth && !isSignedIn)
                        ).map((link, index, filteredLinks) => {
                            return (
                                <DropdownMenuGroup key={link.path}>
                                    <DropdownMenuItem key={link.path} asChild>
                                        <Link to={link.path} className="w-full h-full">
                                            <DropdownMenuLabel className="w-full h-full text-left">
                                                {link.component ? <link.component /> : link.name}
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