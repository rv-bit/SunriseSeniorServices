import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUp, useAuth, useUser } from "@clerk/clerk-react";

import useDocumentTitle from '@/hooks/useDocumentTitle'

import { Post, Get } from '@/lib/utils' // Common functions

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

import { Loader2 } from "lucide-react"

const Signup = () => {
    useDocumentTitle('Sign Up');
    const navigate = useNavigate();

    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate('/account');
            return;
        }

        return () => { };
    }, [isLoaded, isSignedIn]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                    <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-5">
            <div className="max-w-screen-sm mx-auto mb-10">
                <SignUp />
            </div>
        </div>
    );
}

export default Signup;