'use client';
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="flex justify-between bg-green-700 p-5 text-white">
      <div className="w-1/3 ">
        <div className="list-none">
          <Link href="/">Logo</Link>
        </div>
      </div>
      <div className="w-2/3">
        <div className="flex justify-around">
          <Link className="pl-5 hover:text-red-500" href="/login">
            Login
          </Link>
          <Link className="pl-5" href="/signup">
            Signup
          </Link>
          <Link className="pl-5" href="/signup">
            Living Room
          </Link>
          <Link className="pl-5" href="/signup">
            Dining Room
          </Link>
          <Link className="pl-5" href="/signup">
            Bed Room
          </Link>
          <Link className="pl-5" href="/signup">
            Rugs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
