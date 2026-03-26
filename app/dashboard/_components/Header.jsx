"use client"
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Header() {
    const path = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function onDashboard() {
      router.push('/dashboard');
    }

    function onHow() {
      router.push('/how');
    }

    function onTips() {
  router.push('/tips');
  }

  return (
    <div className='flex py-4 px-8 justify-between lg:justify-evenly items-center bg-card border-b shadow-sm'>
        <Image src={'/logo.svg'} width={100} height={100} alt='Logo' className="dark:invert"/>
        <ul className='hidden md:flex gap-8'>
            <li onClick={onDashboard} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/dashboard" ? "text-primary font-bold" : "text-muted-foreground"}`}>Dashboard</li>
            <li onClick={onHow} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/how" ? "text-primary font-bold" : "text-muted-foreground"}`}>How it works?</li>
            <li onClick={onTips} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/tips" ? "text-primary font-bold" : "text-muted-foreground"}`}>Tips & Tricks</li>
        </ul> 
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden md:block">
              <UserButton />
            </div>
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-[72px] left-0 w-full bg-card border-b shadow-md flex flex-col p-4 gap-4 md:hidden z-50">
             <ul className='flex flex-col gap-4'>
                <li onClick={() => { onDashboard(); setIsMenuOpen(false); }} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/dashboard" ? "text-primary font-bold" : "text-muted-foreground"}`}>Dashboard</li>
                <li onClick={() => { onHow(); setIsMenuOpen(false); }} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/how" ? "text-primary font-bold" : "text-muted-foreground"}`}>How it works?</li>
                <li onClick={() => { onTips(); setIsMenuOpen(false); }} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/tips" ? "text-primary font-bold" : "text-muted-foreground"}`}>Tips & Tricks</li>
             </ul>
             <div className="pt-4 border-t flex items-center gap-3">
               <span className="text-sm font-medium text-muted-foreground">Account:</span>
               <UserButton />
             </div>
          </div>
        )}
    </div>
  )
}

export default Header
