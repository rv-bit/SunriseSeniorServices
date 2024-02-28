import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { useDocumentTitle } from '../../utils/UseDocumentTitle.jsx';
import { Post, Get, AuthContext } from '../../utils/Fetching.jsx';

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

export const Login = () => {
  useDocumentTitle('Login')

  const [userIsLoading, setUserLoad] = useState(false);

  const {setUserAuth} = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const UserLoggedIn = Post(`${import.meta.env.VITE_API_PREFIX}/login`, {email, password});
    setUserLoad(true);

    UserLoggedIn.then(response => {
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
      setUserLoad(false);

      return navigate('/');
    });
  }

  const onGoogleLoginOrCreate = useGoogleLogin({
    onSuccess: response => {
      const code = response.code;
      const UserCreateUserBasedOnGoogle = Post(`${import.meta.env.VITE_API_PREFIX}/google/checkAccount`, {code});
      setUserLoad(true);

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
        if (data.user) {
          data.user['isConnected'] = true;
          setUserAuth(data.user);
          setUserLoad(false);

          return navigate('/');
        }
      });
    },
    flow: 'auth-code',
  });

  return (
    <div className="flex items-center justify-center min-h-5">
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-center mb-6">Login</h1>

        <Tabs defaultValue="sign-in" className='w-[400px]'>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Login</TabsTrigger>
            <TabsTrigger value="sign-up"onClick={(event) => { event.stopPropagation(); navigate('/signup'); }}>Sign Up</TabsTrigger>
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
                    <Button className="w-full" onClick={() => {onGoogleLoginOrCreate()}}><AiOutlineGoogle className='mr-2'/>Login with Google</Button>
                }
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}