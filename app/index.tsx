import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const navigateToLogin = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/screens/LoginPage');
    };

    navigateToLogin();
  }, [router]);

  return null;
};

export default Index;
