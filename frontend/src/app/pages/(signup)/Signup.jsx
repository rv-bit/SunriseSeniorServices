import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { Post, Get, AuthContext, useDocumentTitle} from '../../utils'

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
  
  const [userIsLoading, setUserLoad] = useState(false);

  const {setUserAuth} = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;

    // cspell:ignore signup
    const UserCreated = Post(`${import.meta.env.VITE_API_PREFIX || ''}/signup`, {username, email, password, password2});
    UserCreated.then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
          alert(data.Error)

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
      setUserLoad(false);
    },
    onNonOAuthError: response => {
      setUserLoad(false);
    },
    onSuccess: response => {
      const code = response.code;
      const UserCreateUserBasedOnGoogle = Post(`${import.meta.env.VITE_API_PREFIX || ''}/google/signup`, {code});

      UserCreateUserBasedOnGoogle.then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then(data => {
            alert(data.Error)

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

              <form onSubmit={onSubmit}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue='' />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" defaultValue='' />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" defaultValue='' />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password2">Confirm password</Label>
                    <Input id="password2" type="password" defaultValue='' />
                  </div>
                  <div className="space-y-1">
                    { 
                      (userIsLoading) ? 
                        <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button> 
                      :
                        <Button className="w-full" onClick={onSubmit}>Sign Up</Button>
                    }
                  </div>
                </CardContent>
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
                    }}><AiOutlineGoogle className='mr-2'/>Join with Google</Button>
                }
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}