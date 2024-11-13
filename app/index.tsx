import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const navigateToLogin = async () => {
      // Small delay to allow mounting
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/screensAfterLogin/afterlogin');
    };

    navigateToLogin();
  }, [router]);

  return null; // Optionally render a loading state
};

export default Index;
