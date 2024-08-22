"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
const updateName = async (newFirstName: string, newLastName: string) => {
  try {
    const token = localStorage.getItem('token'); // Get the JWT token from local storage

    const res = await fetch('/api/update-name', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName: newFirstName, lastName: newLastName }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Name updated successfully:', data.user);
      // You can update the state or UI with the new name
    } else {
      console.error('Failed to update name:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Handle errors, e.g., redirect to login
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        window.location.href = '/login'; // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/'); // Redirect authenticated users to the dashboard
    }
  }, [router]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loaderVisible, setLoaderVisible] = useState(false);
  const handleUpdate = async () => {
    setLoaderVisible(true); // Show the loader immediately
  
    try {
      await updateName(firstName, lastName);
  
      // After successfully updating, reload the page after a delay
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 4000);
    } catch (error) {
      console.error('Failed to update name:', error);
      // Optionally handle the error, e.g., show an error message to the user
    } finally {
      setLoaderVisible(false); // Hide the loader after the process is complete
    }
  };
  const [edit, setEdit] = useState(false);
const [isEditVisible, setIsEditVisible] = useState(false);
const editRef = useRef(null);
const toggleEditPopup = () => {
  if (!edit) {
    setEdit(true);
    setIsEditVisible(true);
  } else {
    setIsEditVisible(false);
    setTimeout(() => setEdit(false), 500);
  }
  
};
const handleClickOutside = (event) => {
  if (editRef.current && !editRef.current.contains(event.target)) {
    setIsEditVisible(false);
    setTimeout(() => setEdit(false), 500);
  }
  
};
useEffect(() => {
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  return (
    <div className='relative flex items-center justify-center h-screen w-full  ' >

    <Image    src="/assets/images/library.jpg"
fill
priority={true} alt='' className='object-cover'/>
{user && (<div className='relative z-40  bg-[#fffffff7]   py-10 px-6 items-center rounded-2xl flex flex-col gap-5'>
  <div className='flex flex-col   items-center'>
  <div className='flex flex-col items-center gap-2'>
<div className='flex items-center justify-center h-40 w-40  rounded-full bg-red text-white text-6xl  ring-[10px] ring-pink  font-bold'>
{user.firstName[0]}.{user.lastName[0]}
</div>
<div className='flex gap-2  items-center'>
<h1 className='font-bold  text-[30px]'>{user.firstName} {user.lastName}</h1>
<button onClick={toggleEditPopup}>
<img src={'/assets/icons/edit.svg'} alt='' className='w-6' />
</button>
</div>
</div>
<div className='flex flex-col items-center'>
<h1 className='font-semibold text-base'>{user.email}</h1>
<div className='py-0 px-2 border border-black bg-black text-xs font-semibold rounded-full text-white'>
ID: {user._id}
</div>
</div>
</div>
<button onClick={async () => {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login after logout
          }} className='text-base font-semibold bg-pink  text-red p-2 rounded-full px-4 self-end '>
  Logout
</button>
</div>)}
{edit && (
       <div className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8   xs:items-end  xs:px-0 `}>
       <div className={`w-[400px]  rounded-2xl   pop  duration-300 ease-in-out xs:w-full bg-[#fffffff7]   ${isEditVisible ? '' : 'pop-hidden'}`} ref={editRef} >
       <div  className="flex flex-col p-4 gap-3">
        <div className="flex flex-col ">
        <label htmlFor="name" className="text-sm font-semibold">Name:</label>
          <input
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter new name"
            className="text-sm font-semibold text-black  outline-none px-2 py-3 rounded-md border  border-lightGrey"
          />
          </div>
          <div  className="flex flex-col ">
          <label htmlFor="surname" className="text-sm font-semibold">Surname:</label>
          <input

            placeholder="Enter new surname"
            className="text-sm font-semibold text-black outline-none px-2 py-3 rounded-md border  border-lightGrey"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          </div>
      <div className="w-full items-center justify-between flex pt-3">
          <button onClick={handleUpdate} className="bg-black   px-4 py-3 rounded-2xl text-white  text-sm font-semibold ease-out duration-300">{loaderVisible ? (<img src={'/assets/images/spinner.gif'} className="w-6" alt=""/>): 'Update'}</button>
          <button type="button" className="  px-4 py-3 rounded-2xl text-red text-sm font-semibold hover:bg-pink  ease-out duration-300"  onClick={() => {
  toggleEditPopup();
}}>Cancel</button>
          </div>
        </div>
         </div>
         </div>
            )}

  </div>

  );
};

export default ProfilePage;
