import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import Head from 'next/head';
import Signup from '@/components/signup/Signup';
import Login from '@/components/login/Login'

const Auth = () => {
  const authState = useSelector((state) => state.auth || {});
  const router = useRouter();
  const [authType, setAuthType] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (authState.loggedIn && token) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn, router]);

  return (
    <>
      <Head>
        <title>{authType ? 'Sign Up | LinkedIn' : 'Sign In | LinkedIn'}</title>
        <meta
          name="description"
          content="Log in or create your free account on LinkedIn to connect with professionals, explore career opportunities, and share updates."
        />
      </Head>
      {authType ? (
        <Signup onSwitchToLogin={() => setAuthType(false)} />
      ) : (
        <Login onSwitchToSignup={() => setAuthType(true)} />
      )}
    </>
  )
}

export default Auth