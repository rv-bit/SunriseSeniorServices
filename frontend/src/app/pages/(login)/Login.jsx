import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignIn, useAuth, useUser } from '@clerk/clerk-react'

import useDocumentTitle  from '@/app/hooks/UseDocumentTitle' // Custom hooks

import { Notification } from '@/app/components/custom/Notifications' // Custom components
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

    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate('/account');
            return;
        }

        const infoFromPreviousPage = location.state?.info;
        if (infoFromPreviousPage) {
            setAlertState({ ...alertState, open: true, message: info });
        }

        return () => {};
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
            {alertState.open && (
                <Notification
                    alertState={alertState}
                    setAlertState={setAlertState}
                />
            )}

            <div className="max-w-screen-sm mx-auto mb-10">
                <SignIn />
            </div>
        </div>
    )
}

export default Login;