import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { Post, Get, AuthContext, useDocumentTitle, Notification } from '../../utils'
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
  const {setUserAuth} = useContext(AuthContext);

  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const onSubmitFinal = (e) => {
    setIsSubmitted(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const password2 = formData.get('password2');

    // cspell:ignore signup
    const UserCreated = Post(`${import.meta.env.VITE_API_PREFIX}/signup`, {username, email, password, password2});
    UserCreated.then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
          setAlertState({ ...alertState, open: true, message: data.Error });

          throw new Error(`Request failed with status code ${response.status}`);
        });
      }
    })
    .then(data => {
      data.user['isConnected'] = true;
      setUserAuth(data.user);
      return navigate('/');
    });
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
      const code = response.code;
      const UserCreateUserBasedOnGoogle = Post(`${import.meta.env.VITE_API_PREFIX}/google/signup`, {code});

      UserCreateUserBasedOnGoogle.then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then(data => {
            setAlertState({ ...alertState, open: true, message: data.Error });

            throw new Error(`Request failed with status code ${response.status}`);
          });
        }
      })
      .then(data => {
        if (data.accountExistsAlready) {
          alert('Account already exists, please login')
          return navigate('/login');
        }
      });
    },
    flow: 'auth-code',
  });

  return (
    <div className="flex items-center justify-center min-h-5">
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-center mb-6">Sign Up</h1>
        
        <Tabs defaultValue="sign-up" className='w-[400px]'>
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
                    }}><AiOutlineGoogle className='mr-2'/>Continue with Google</Button>
                }
              </CardFooter>

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