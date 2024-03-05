import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { Notification, useDocumentTitle } from '../../utils' // Custom hooks
import { Post, Get, AuthContext, googleCheckAccount, userLogIn } from '../../utils/utils' // Common functions

import { FormCreateAccount } from '../index';

import { Loader2 } from "lucide-react"
import { AiOutlineGoogle } from "react-icons/ai";
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

export const Signup = () => {
  useDocumentTitle('Sign Up');
  const navigate = useNavigate();

  const {userAuthData, setUserAuth} = useContext(AuthContext);
  useEffect(() => {
    if (userAuthData && userAuthData.length > 0 || userAuthData && userAuthData.isConnected) {
      navigate('/');
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
          const [status, promiseDataLogin] = await userLogIn(formData);

          if (!status) {
            setUserLoad(false);
            setAlertState({ ...alertState, open: true, message: promiseDataLogin.Error });
            return;
          }

          promiseDataLogin.user['isConnected'] = true;
          setUserAuth(promiseDataLogin.user);

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
        <Tabs defaultValue="sign-up" className='w-[400px] max-sm:w-[350px]'>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in" onClick = {() => { navigate('/login') }}>Login</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-up">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create a new account using your email and password.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => navigate('/signup/get-started')}>Continue with Email</Button>
              </CardContent>

              <CardContent>
                { 
                  (userIsLoading) ? 
                    <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button> 
                  :
                    <Button className="w-full" onClick={() => {
                      setUserLoad(true);
                      onGoogleLoginOrCreate()
                    }}><AiOutlineGoogle className='mr-2'/>Continue with Google</Button>
                }
              </CardContent>

              <CardContent className="space-y-2 text-center">
                <Label onClick={(event) => {event.preventDefault(); navigate('/login');}} className="text-center mb-6">Have an account ? <Label className='underline text-cyan-600 hover:text-sky-400 cursor-pointer'>Sign In</Label></Label>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {alertState.open && (
          <Notification
            open={alertState.open}
            handleClose={alertHandleClose}
            message={alertState.message}
          />
        )}
      </div>
    </div>
  );
}