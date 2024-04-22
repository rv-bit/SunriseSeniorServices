import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import AuthProvider from '@/app/providers/AuthProvider'
import useDocumentTitle  from '@/app/hooks/UseDocumentTitle' // Custom hooks

import { Notification } from '@/app/components/custom/Notifications' // Custom components
import { Post, Get, userLogIn } from '@/app/lib/utils' // Common functions

import { useUser, SignIn } from "@clerk/clerk-react";

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

const Login = () => {
    useDocumentTitle('Login')

    const navigate = useNavigate();
    const location = useLocation();

    const { isSignedIn, user, isLoaded } = useUser();
    const {userAuthData, setUserAuth} = useContext(AuthProvider);

    useEffect(() => {
        if (userAuthData && userAuthData.length > 0) {
            navigate('/');
            return;
        }

        const infoFromPreviousPage = location.state?.info;
        if (infoFromPreviousPage) {
            setAlertState({ ...alertState, open: true, message: info });
        }

        return () => {};
    }, []);

    const [userIsLoading, setUserLoad] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });

    // const onSubmit = (e) => {
    //     e.preventDefault();    
    //     const email = e.target.email.value;
    //     const password = e.target.password.value;

    //     const handleSuccess = async () => {
    //         setUserLoad(true);

    //         const formData = {email: email, password: password};
    //         const [status, promiseData] = await userLogIn(formData);

    //         if (!status) {
    //             setUserLoad(false);
    //             setAlertState({ ...alertState, open: true, message: promiseData.Error });
    //             return;
    //         }

    //         promiseData.user['isConnected'] = true;
    //         setUserAuth(promiseData.user);
    //         setUserLoad(false);
    //         navigate('/');
    //     };

    //     handleSuccess();
    // }

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
    //                 const [status, promiseData] = await userLogIn(formData);

    //                 if (!status) {
    //                     setUserLoad(false);
    //                     setAlertState({ ...alertState, open: true, message: promiseData.Error });
    //                     return;
    //                 }

    //                 promiseData.user['isConnected'] = true;
    //                 setUserAuth(promiseData.user);

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

    console.log(isSignedIn, isLoaded, userAuthData, user, userIsLoading, alertState)

    return (
        <div className="flex items-center justify-center min-h-5">
            {alertState.open && (
                <Notification
                    alertState={alertState}
                    setAlertState={setAlertState}
                />
            )}

            <div className="max-w-screen-sm mx-auto mb-10">
                {/* <Tabs defaultValue="sign-in" className='w-[400px] max-sm:w-[350px]'>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">Login</TabsTrigger>
                        <TabsTrigger value="sign-up" onClick={(event) => { event.stopPropagation(); navigate('/signup'); }}>Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="sign-in">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Login to your account using your email and password.
                                </CardDescription>
                            </CardHeader>

                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </Card>
                    </TabsContent>
                </Tabs> */}

                {(!isSignedIn && isLoaded) && (
                    <SignIn />
                )}
            </div>
        </div>
    )
}

export default Login;