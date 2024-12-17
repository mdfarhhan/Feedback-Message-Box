'use client'
import Link from 'next/link'
import React from 'react'
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'
const Navbar = () => {
    const {data:session} = useSession();
    const user:User = session?.user
  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row items-center justify-between'>
            <a href="#" className='text-xl font-bold mb-4 md:mb-0' >Mystry Message</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>Welcome, {user.username || user.email}</span>
                    <button onClick={() => signOut()} className='w-full md:w-auto'>Logout</button>
                    </>
                ):(<Link href="/login"><button className='w-full md:w-auto'>Login</button></Link>)
            }
        </div>
    </nav>
  )
}

export default Navbar
