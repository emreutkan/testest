import { useEffect } from 'react';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const navigateToLogin = async () => {
      // Small delay to allow mounting
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/screens/LoginPage');

      // router.push('/screensAfterLogin/afterlogin');
      // router.push('/accountscreen/demo');

    };

    navigateToLogin();
  }, [router]);

  return null; // Optionally render a loading state
};

export default Index;
