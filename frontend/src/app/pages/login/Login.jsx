import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import AuthContext from '@/app/context/AuthContext'
import useDocumentTitle  from '@/app/hooks/UseDocumentTitle' // Custom hooks

import { Notification } from '@/app/components/custom/Notifications' // Custom components
import { Post, Get, googleCheckAccount, userLogIn } from '@/app/lib/utils' // Common functions

import FormCreateAccount from '../get-started-form/FormCreateAccount';

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
    
    const {userAuthData, setUserAuth} = useContext(AuthContext);

    useEffect(() => {
        if (userAuthData && userAuthData.length > 0 || userAuthData && userAuthData.isConnected) {
            navigate('/');
            return;
        }
    }, []);

    const [userIsLoading, setUserLoad] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });


    const alertHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertState({ ...alertState, open: false });
    }

    const onSubmit = (e) => {
        e.preventDefault();    
        const email = e.target.email.value;
        const password = e.target.password.value;

        const handleSuccess = async () => {
            setUserLoad(true);

            const formData = {email: email, password: password};
            const [status, promiseData] = await userLogIn(formData);

            if (!status) {
                setUserLoad(false);
                setAlertState({ ...alertState, open: true, message: promiseData.Error });
                return;
            }

            promiseData.user['isConnected'] = true;
            setUserAuth(promiseData.user);
            setUserLoad(false);
            navigate('/');
        };

        handleSuccess();
    }

    const onGoogleLoginOrCreate = useGoogleLogin({
        onError: response => {
            setAlertState({ ...alertState, open: true, message: response.message + ', please try again.' });
            setUserLoad(false);
        },
        onNonOAuthError: response => {
            setAlertState({ ...alertState, open: true, message: response.message + ', please try again.' });
            setUserLoad(false);
        },
        onSuccess: response => {  
            setUserLoad(true);

            const code = response.code;
            const handleSuccess = async () => {
                const [statusGoogle, promiseGoogleAccount] = await googleCheckAccount(code);

                if (!statusGoogle) {
                    setUserLoad(false);
                    navigate('/');
                    return;
                };

                if (promiseGoogleAccount.accountExistsAlready) {
                    const User = promiseGoogleAccount.user;
                    const formData = {email: User.email, password: User.password};
                    const [status, promiseData] = await userLogIn(formData);

                    if (!status) {
                        setUserLoad(false);
                        setAlertState({ ...alertState, open: true, message: promiseData.Error });
                        return;
                    }

                    promiseData.user['isConnected'] = true;
                    setUserAuth(promiseData.user);

                    setUserLoad(false);
                    navigate('/');
                    return;
                }

                navigate('/signup/get-started', { state: { informationGiven: promiseGoogleAccount } });
            };

            handleSuccess();
        },
        flow: 'auth-code',
    });

    return (
        <div className="flex items-center justify-center min-h-5">
            {alertState.open && (
                <Notification
                open={alertState.open}
                handleClose={alertHandleClose}
                message={alertState.message}
                />
            )}

            <div className="max-w-screen-sm mx-auto mb-10">
                <Tabs defaultValue="sign-in" className='w-[400px] max-sm:w-[350px]'>
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

                            <form onSubmit={onSubmit}>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type='email' defaultValue="" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type='password' defaultValue="" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                { 
                                    (userIsLoading) ? 
                                    <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button> 
                                    :
                                    <Button type="submit" className="w-full">Login with Email</Button>
                                }
                                </CardFooter>
                            </form>

                            <CardContent className="space-y-2 text-center">
                                <Label className="text-center mb-6">or</Label>
                            </CardContent>

                            <CardFooter>
                                { 
                                (userIsLoading) ? 
                                    <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button> 
                                :
                                    <Button className="w-full" onClick={() => {
                                    setUserLoad(true);
                                    onGoogleLoginOrCreate()
                                    }}><AiOutlineGoogle className='mr-2'/>Login with Google</Button>
                                }
                            </CardFooter>
                            
                            <CardContent className="space-y-2 text-center">
                                <Label onClick={(event) => {event.preventDefault(); navigate('/signup');}} className="text-center mb-6">Don't have an account, <Label className='underline text-cyan-600 hover:text-sky-400 cursor-pointer'>Join</Label></Label>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Login;