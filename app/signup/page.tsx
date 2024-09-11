"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, ChangeEvent, FormEvent , useEffect} from 'react';
import { useRouter } from 'next/navigation';
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        window.location.href = '/login';
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/'); // Redirect authenticated users to the dashboard
    }
  }, [router]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <div   className='relative flex items-center justify-center h-screen w-full  px-2'>
            <Link href="/" className="flex  items-center text-3xl font-[800] md:text-2xl  2xs:shrink-0  absolute top-3 left-4 z-40">
            <img
      src="/assets/images/me.png"
  className="w-5   md:w-4" alt="library"
    />
    <h1 className="text-white">BookNest</h1>
</Link>
            <Image    src="/assets/images/library.jpg"
fill
priority={true} alt='' className='object-cover'/>
<div className='relative  z-40  bg-[#fffffff7] px-4 py-10 flex flex-col  w-[500px] rounded-2xl border border-2 border-red  gap-3 shadow-lg'>
<div>
      <h1 className='text-3xl font-bold text-center text-red leading-none'>Welcome</h1>
      <h1 className='text-sm font-semibold text-center text-grey'>Please enter details to sign up.</h1>
      </div>
<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
  <div className='flex items-center gap-2'>
  <div className="flex flex-col  w-full text-darkGrey">
        <label htmlFor="first name" className="text-sm font-semibold">First name:</label>
        <input
         type="text"
         name="firstName"
         value={formData.firstName}
         onChange={handleChange}
         placeholder="First Name"
         required
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full `}
      />

          </div>
          <div className="flex flex-col  w-full text-darkGrey">
        <label htmlFor="last nme" className="text-sm font-semibold">Last name:</label>
        <input
         type="text"
         name="lastName"
         value={formData.lastName}
         onChange={handleChange}
         placeholder="Last Name"
         required
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full `}
      />

          </div>
  </div>

<div className="flex flex-col  w-full text-darkGrey">
        <label htmlFor="email" className="text-sm font-semibold">Email:</label>
        <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
           className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full `}
      />

          </div>


          <div className={` flex gap-2  rounded-md pr-2  border border-grey `}>
        <input
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Password"
  required
          className={`text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full text-darkGrey  `}
          type={isPasswordVisible ? 'text' : 'password'}
      />
      <button   onClick={handleTogglePasswordVisibility}  type="button">
      <img
       alt=""  src={isPasswordVisible ?'/assets/icons/eye-close.svg' : '/assets/icons/eye-open.svg'}

className="w-5  h-5"
   />
      </button>
      </div>
      <div className='flex items-center justify-between  pt-2'>
        <button type="submit" className='bg-black text-sm font-semibold py-2 w-[100px] text-white rounded-full hover:bg-red transition duration-300 ease-out'>Sign up</button>
        <Link href="/login" className='text-xs text-grey underline'>Already  have an account?</Link>
        
        </div>
    </form>
</div>

    </div>
  );
}
