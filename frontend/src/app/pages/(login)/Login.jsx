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
    }, []);

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
            </div>
        </div>
    )
}

export default Login;