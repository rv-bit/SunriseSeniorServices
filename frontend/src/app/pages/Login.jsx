import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {config} from '../common/config.js'

import { Post, Get, AuthContext } from '../utils/Fetching.jsx';

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
  const {setUserAuth} = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const UserLoggedIn = Post(`${config.apiPrefix}/login`, {email, password});
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
      return navigate('/');
    });
  }

  return (
    <div className="flex items-center justify-center min-h-5">
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-center mb-6">Login</h1>

        <Tabs defaultValue="sign-in" className='w-[400px]'>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Login</TabsTrigger>
            <TabsTrigger value="sign-up"onClick={(event) => { event.stopPropagation(); navigate('/signup'); }}>Sign Up</TabsTrigger>
          </TabsList>

          <form onSubmit={onSubmit}>
            <TabsContent value="sign-in">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Login to your account using your email and password.
                  </CardDescription>
                </CardHeader>
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
                  <Button type="submit">Login</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>

        </Tabs>
      </div>
    </div>
  )
}