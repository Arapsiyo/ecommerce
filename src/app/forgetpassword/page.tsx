'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ForgetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleClick = async (e: any) => {
    e.preventDefault();
    try {
      console.log('email: ', email);

      const res = await axios.post('/api/users/forgetpassword', { email });
      console.log('Email sent success');
      console.log('res data', res.data);

      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Enter Your Email</h1>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleClick}>Enter</button>
    </div>
  );
};

export default ForgetPasswordPage;
