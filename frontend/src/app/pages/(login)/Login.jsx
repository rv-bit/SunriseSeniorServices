import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react'

import useDocumentTitle  from '@/app/hooks/useDocumentTitle' // Custom hooks
import useUserAuth from '@/app/hooks/useUserAuth' // Custom hooks

import { Post, Get } from '@/app/lib/utils' // Common functions

import { Loader2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs"

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

        return () => {};
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