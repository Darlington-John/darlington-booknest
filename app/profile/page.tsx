"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
      }, 1000);
    } catch (error) {
      console.error('Failed to update name:', error);
      // Optionally handle the error, e.g., show an error message to the user
    } finally {
      setLoaderVisible(false); // Hide the loader after the process is complete
    }
  };
  const [edit, setEdit] = useState(false);
const [isEditVisible, setIsEditVisible] = useState(false);
const editRef = useRef<HTMLDivElement>(null);
const toggleEditPopup = () => {
  if (!edit) {
    setEdit(true);
    setIsEditVisible(true);
  } else {
    setIsEditVisible(false);
    setTimeout(() => setEdit(false), 500);
  }
  
};
const handleClickOutside = (event: any) => {
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

const [editImage, setEditImage] = useState(false);
const [isEditImageVisible, setIsEditImageVisible] = useState(false);
const editImageRef = useRef<HTMLDivElement>(null);
const toggleEditImagePopup = () => {
  if (!editImage) {
    setEditImage(true);
    setIsEditImageVisible(true);
  } else {
    setIsEditImageVisible(false);
    setTimeout(() => setEditImage(false), 500);
  }
  
};
const handleClickOutsideImage = (event: any) => {
  if (editImageRef.current && !editImageRef.current.contains(event.target)) {
    setIsEditImageVisible(false);
    setTimeout(() => setEditImage(false), 500);
  }
  
};
useEffect(() => {
  document.addEventListener('mousedown', handleClickOutsideImage);
  return () => {
    document.removeEventListener('mousedown', handleClickOutsideImage);
  };
}, []);
const [file, setFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [imageUrl, setImageUrl] = useState<string | null>(null);
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    setFile(selectedFile);

    // Generate a preview of the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string); // Set the preview image URL
    };
    reader.readAsDataURL(selectedFile); // Read the selected file as a Data URL
  }
};

const handleUpload = async () => {
  
  if (!file) {

    return;
  }

  setUploading(true);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/upload-profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
 
      setImageUrl(data.url);
      window.location.reload();
    } else {
      alert(`Upload failed: ${data.error}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('An error occurred while uploading the file.');
  } finally {
    setUploading(false);
  }
};
const fileInputRef = useRef<HTMLInputElement | null>(null);

const handleClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

  return (
    <div className='relative flex items-center justify-center h-screen w-full  xs:px-3 ' >

    <Image    src="/assets/images/library.jpg"
fill
priority={true} alt='' className='object-cover'/>
{user && (<div className='relative z-40  bg-[#fffffff7]   py-10 px-6 items-center rounded-2xl flex flex-col gap-8   xs:w-full w-[400px]'>
  <div className='flex flex-col   items-center'>
  <div className='flex flex-col items-center gap-2'>
<div className='flex items-center justify-center h-40 w-40  rounded-full bg-red text-white text-6xl  ring-[10px] ring-pink  font-bold  xs:h-32 xs:w-32  xs:text-5xl relative readingBook  overflow-hidden'>
<button className='w-full h-full absolute  top-0 left-0 bg-[#0000006b] flex items-center justify-center  readingBook-button flex-col gap-0' onClick={toggleEditImagePopup}>
      <img src={'/assets/icons/pen.svg'} alt='' className='w-8  xs:w-4' />
      <h1 className='text-base font-semibold text-center'>  {user.profile? 'Change photo': 'Upload photo'}</h1>
      </button>
  {user?.profile? (   <img src={user.profile} alt='' className='w-full h-full object-cover '/> 

    ):(<>
    {user.firstName[0]}.{user.lastName[0]}</>)}
</div>
<div className='flex gap-2  items-center'>
<h1 className='font-bold  text-[30px]  xs:text-2xl'>{user.lastName} {user.firstName} </h1>
<button onClick={toggleEditPopup}>
<img src={'/assets/icons/edit.svg'} alt='' className='w-6  xs:w-4' />
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
<div className='w-full flex flex-col gap-2 '>
<button onClick={async () => {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login after logout
          }} className='text-base font-semibold bg-red  text-white   p-2 rounded-lg px-4 self-end w-full  hover:bg-black   hover:text-white transition  duration-150 ease-it'>
  Logout {loading && null }
</button>
</div>

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
{editImage && (
       <div className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-4 `}>

       <div className={`w-[300px]  rounded-2xl   pop  duration-300 ease-in-out 2xs:w-full bg-[#fffffff7] flex flex-col  items-center gap-6 pt-8  pb-6  px-5 relative   ${isEditImageVisible ? '' : 'pop-hidden'}`} ref={editImageRef} >
        <button className='bg-pink h-8 w-8 rounded-full flex items-center justify-center absolute top-2 right-2' onClick={toggleEditImagePopup}>
<img src={'/assets/icons/xmark-red.svg'} alt='' className='w-3'/>
        </button>
       <div className='flex w-full flex-col  items-center justify-center gap-4'>
       <div className='flex items-center justify-center h-40 w-40  rounded-full  text-white text-6xl  ring-[10px] ring-pink  font-bold  xs:h-32 xs:w-32  xs:text-5xl relative readingBook overflow-hidden'>

{imageUrl ? (
      <div className="w-full h-full relative overflow-hidden rounded-full readingBook">
        <img src={imageUrl} alt="Selected Profile Preview" className="w-full h-full object-cover" />
      </div>
    ) : (

         <img src={'/assets/images/user.png'} alt="Current Profile" className="w-full h-full object-cover" />
      
    )}

   
</div>
<h1 className='text-lg text-red font-medium text-center'>
      {user.profile? 'Change profile photo': 'Upload profile photo'}
    </h1>
</div>
<div className='w-full  items-center  justify-between flex'>
<button className='bg-pink  h-[40px] px-4 text-sm font-semibold text-red rounded-lg  flex gap-1 items-center justify-center  hover:ring-1 ring-red duration-300 ease-out  ' onClick={handleClick}>
  <span>File</span>
<img src={'/assets/icons/file-import.svg'} className='w-3' alt=""/>
</button>
   <button onClick={handleUpload} disabled={!file} className='bg-red  hover:ring-2  ring-red  duration-300 ease-out flex items-center justify-center text-center text-sm  h-[40px] w-[90px] rounded-lg text-white ring-offset-[1px]'>
        {uploading ? (<img src={'/assets/images/doubleWhite.gif'} alt="" className='w-5'/>) : 'Upload'}
      </button>
</div>
       <input type="file" onChange={handleFileChange}    ref={fileInputRef} className='hidden' />
   
         </div>
         </div>
            )}
  </div>

  );
};

export default ProfilePage;
