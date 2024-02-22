"use client"

import { auth } from "@/config/Firebase";
import { UserCredential, onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react"
import { signInWithTwitter, signInWithGithub, signInWithGoogle } from '@/config/Firebase';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { PiHandWavingThin } from "react-icons/pi";
import { ImSpinner10 } from "react-icons/im";
import Loader from "@/components/Loader";
import { createUserProfileDocument, exitPockerTable, joinPockerTable, updatePlayerNote } from "@/config/Firestore";
import { update } from "firebase/database";


interface Props {
    children: React.ReactNode
}

export interface IUser {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

interface IContext {
    user: IUser
    signInWithGoogle: () => Promise<UserCredential>
    signInWithTwitter: () => Promise<UserCredential>
    signInWithGithub: () => Promise<UserCredential>
    logout: () => void
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const AuthContext = createContext({} as IContext);

export const AuthContextProvider = ({children}:Props) => {
    const [user, setUser] = useState<IUser>({} as IUser);
    const [loading, setLoading] = useState<boolean>(true)

    const router = useRouter()
    useEffect(() => {
        const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.replace("/login");
            }
            setLoading(false);
        });
        return () => unsubscribeFromAuth();
    }, [user, router]);

    const logout = async () => {
        await updatePlayerNote(user.uid, 0)
        await exitPockerTable(user);
        await signOut(auth);
        setUser({}as IUser);
        router.replace('/');
        toast.success('See you soon !');
    }
    return (
        loading ? (
            <main className="flex items-center justify-center h-screen w-screen">
                <Loader fill="#37cdbe" />
            </main>
        ):
        (<AuthContext.Provider value={{user, signInWithGoogle, signInWithGithub, signInWithTwitter, logout, setLoading}}>
            { children }
        </AuthContext.Provider>)
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
}
