"use client";
import { UserAuth } from "@/context/AuthentificationContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";

const Navbar = () => {
    const { user, logout } = UserAuth();
    return (
        <div className="navbar bg-base-400 shadow-xl top-0 left-0">
            <div className="navbar-start">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <Link href="/">Homepage</Link>
                        </li>
                        <li>
                            <Link href="/login">Login</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link href={"/"} className="btn btn-ghost text-xl">
                    Note Share
                </Link>
            </div>
            <div className="navbar-end space-x-2 px-3">
                {user.uid ? (
                    <div className="tooltip tooltip-bottom" data-tip="Logout !">
                        <button className="btn btn-ghost btn-circle" onClick={logout}>
                            <AiOutlineLogout className="text-xl" />
                        </button>
                    </div>
                ) : (
                    <div className="tooltip tooltip-bottom" data-tip="Login !">
                        <Link href='/login' className="btn btn-ghost btn-circle">
                            <AiOutlineLogin className="text-xl" />
                        </Link>
                    </div>
                )}

                <div className="avatar placeholder">
                    {user?.uid ? (
                        user.photoURL ? (
                            <div className="w-10 rounded-full">
                                <img src={user.photoURL} alt="#" />
                            </div>):
                        ( user.displayName && <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-xl">
                                { user.displayName[0].toUpperCase() }
                            </span>
                        </div>)
                    ) : (
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-xl">
                                N
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
