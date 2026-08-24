import React, { useEffect } from 'react'
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useRouter } from 'next/router';

const UserLayout = ({ children }) => {
    // const router = useRouter();

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token && router.pathname !== "/auth") {
    //         router.push("/auth");
    //     }
    //     if (token) {
    //         router.push("/dashboard");
    //     }
    // }, [router.pathname])

    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default UserLayout;