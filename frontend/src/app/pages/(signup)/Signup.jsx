import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignUp } from "@clerk/clerk-react";

import AuthProvider from '@/app/providers/AuthProvider'
import useDocumentTitle from '@/app/hooks/UseDocumentTitle' // Custom hooks

import { Notification } from '@/app/components/custom/Notifications' // Custom components
import { Post, Get, userLogIn } from '@/app/lib/utils' // Common functions

import { Loader2 } from "lucide-react"
import { AiOutlineGoogle } from "react-icons/ai";
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

const Signup = () => {
    useDocumentTitle('Sign Up');

    const navigate = useNavigate();

    const { isSignedIn, user, isLoaded } = useUser();
    const {userAuthData, setUserAuth} = useContext(AuthProvider);

    useEffect(() => {
        if (userAuthData && userAuthData.length > 0) {
            navigate('/');
            return;
        }
    }, []);

    const [userIsLoading, setUserLoad] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });

    // const onGoogleLoginOrCreate = useGoogleLogin({
    //     onError: response => {
    //         setAlertState({ ...alertState, open: true, message: response.message + ', please try again.' });
    //         setUserLoad(false);
    //     },
    //     onNonOAuthError: response => {
    //         setAlertState({ ...alertState, open: true, message: response.message + ', please try again.' });
    //         setUserLoad(false);
    //     },
    //     onSuccess: response => {
    //         setUserLoad(true);

    //         const code = response.code;
    //         const handleSuccess = async () => {
    //             const [statusGoogle, promiseGoogleAccount] = await googleCheckAccount(code);

    //             if (!statusGoogle) {
    //                 setUserLoad(false);
    //                 navigate('/');
    //                 return;
    //             };

    //             if (promiseGoogleAccount.accountExistsAlready) {
    //                 const User = promiseGoogleAccount.user;
    //                 const formData = {email: User.email, password: User.password};
    //                 const [status, promiseDataLogin] = await userLogIn(formData);

    //                 if (!status) {
    //                     setUserLoad(false);
    //                     setAlertState({ ...alertState, open: true, message: promiseDataLogin.Error });
    //                     return;
    //                 }

    //                 promiseDataLogin.user['isConnected'] = true;
    //                 setUserAuth(promiseDataLogin.user);

    //                 setUserLoad(false);
    //                 navigate('/');
    //                 return;
    //             }

    //             navigate('/signup/get-started', { state: { informationGiven: promiseGoogleAccount } });
    //         };

    //         handleSuccess();
    //     },
    //     flow: 'auth-code',
    // });

    return (
        <div className="flex items-center justify-center min-h-5">
            {alertState.open && (
                <Notification
                    alertState={alertState}
                    setAlertState={setAlertState}
                />
            )}

            <div className="max-w-screen-sm mx-auto mb-10">
                {(!isSignedIn && isLoaded) && (
                    <SignUp />
                )}
            </div>
        </div>
    );
}

export default Signup;