import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react'

import useDocumentTitle from '@/hooks/useDocumentTitle' // Custom hooks
import useUserAuth from '@/hooks/useUserAuth' // Custom hooks

import { Post, Get } from '@/lib/utils' // Common functions

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const Login = () => {
    useDocumentTitle('Login')

    const navigate = useNavigate();
    const location = useLocation();

    const { isLoaded, isSignedIn, user } = useUserAuth();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate('/account');
            return;
        }

        return () => { };
    }, [isSignedIn, isLoaded]);

    return (
        <div className="flex items-center justify-center min-h-5">
            <div className="max-w-screen-sm mx-auto mb-10">
                <SignIn />
            </div>
        </div>
    )
}

export default Login;