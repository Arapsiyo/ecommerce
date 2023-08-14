'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState(false);
  // const [password, setPassword] = useState('');
  const [forgetToken, setForgetToken] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    console.log('url token: ', urlToken);

    setForgetToken(urlToken);
  }, [forgetToken]);

  const handleClick = async (e: any) => {
    e.preventDefault();
    // call the api with the new password and forget token

    try {
      const user = {
        password: password,
        forgetToken: forgetToken,
      };

      console.log('user front : ', user);

      const response = await axios.post('/api/users/resetpassword', user);
      console.log('Signup success', response.data);
      router.push('/login');
      //router.push('/login');
    } catch (error: any) {
      setError(true);
      console.log(error.reponse.data);
    }
  };
  return (
    <div>
      <label htmlFor="">Enter New Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClick={handleClick}
      />
      <button onClick={handleClick}>Reset</button>
    </div>
  );
};

export default ResetPasswordPage;
