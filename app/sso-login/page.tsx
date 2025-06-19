'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const SSOLoginPage = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenn = localStorage.getItem('authToken');
  const paramTokenn = searchParams.get('token'); 

  useEffect(() => {
    const user_id = searchParams.get('user_id');
    const first_name = searchParams.get('first_name');
    const last_name = searchParams.get('last_name');
    const user_name = searchParams.get('user_name');
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const return_url = searchParams.get('return_url');



    if (user_id && first_name && last_name && user_name && email && token) {
      // Get existing token from localStorage
      const storedToken = localStorage.getItem('authToken');


      if (tokenn === paramTokenn) {
        // Tokens match, set user and redirect to home

        const userData = { id: user_id, first_name, last_name, user_name, email };
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser({ id: user_id, first_name, last_name, user_name, email, token });
        router.push('/');
      } else {
        // Tokens don't match, verify token with backend

        axios
          .get('https://1q3rk7l6-5000.inc1.devtunnels.ms/api/v1/auth/verify-token', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {

            const apiUserData = response.data.data.user || response.data.user;

            // Store token (use query token since API doesn't return a new one)
            localStorage.setItem('authToken', token);

            // Combine API data with query params as fallback
            const newUserData = {
              id: apiUserData.id?.toString() || user_id,
              first_name: apiUserData.first_name || first_name,
              last_name: apiUserData.last_name || last_name,
              user_name: apiUserData.user_name || user_name,
              email: apiUserData.email || email,
            };

            localStorage.setItem('userData', JSON.stringify(newUserData));

            // Set user in AuthContext
            setUser({
              id: newUserData.id,
              first_name: newUserData.first_name,
              last_name: newUserData.last_name,
              user_name: newUserData.user_name,
              email: newUserData.email,
              token,
            });


            router.push('/');
          })
          .catch((error) => {
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
           ;
            window.parent.postMessage({ action: 'login_required' }, '*');
            if (return_url) {
             
              window.location.href = return_url;
            } else {
              
              router.push('/login');
            }
          });
      }
    } else {
      
      window.parent.postMessage({ action: 'login_required' }, '*');
      router.push('/login');
    }
  }, [searchParams, setUser, router, tokenn, paramTokenn]);

  return <div></div>;
};

export default SSOLoginPage;