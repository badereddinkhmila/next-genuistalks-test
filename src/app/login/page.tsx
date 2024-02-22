"use client"
import { AiOutlineGithub, AiOutlineGoogle, AiOutlineTwitter } from "react-icons/ai";
import { GiNotebook } from "react-icons/gi";
import { toast } from 'react-hot-toast';
import { UserAuth } from "@/context/AuthentificationContext";
import { useRouter } from "next/navigation";

const Login = () => {
    const { signInWithGithub, signInWithGoogle, signInWithTwitter } = UserAuth();
    const router = useRouter()

    const signIn = async (fn:Function) => {
        await fn();
        toast.success('Good to see you!');
        router.push('/')
    }
  return (
    <div className="flex justify-center items-center h-screen w-full">
    <div className="card w-3/5 bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <h2 className="card-title font-mono">Welcome !</h2>
        <div className="card-body">
            <GiNotebook className="text-9xl"/>
        </div>
        <div className="card-actions space-y-7 xl:space-y-0 justify-around w-full">
          <button className="btn btn-primary text-slate-100 w-full xl:w-fit" onClick={()=>signIn(signInWithGoogle)}>
            Google account
            <AiOutlineGoogle className="sm:text-2xl"/>
          </button>
          <button className="btn btn-accent text-slate-100 w-full xl:w-fit" onClick={()=>signIn(signInWithGithub)}>
          Github account
            <AiOutlineGithub className="sm:text-2xl"/>
          </button>
          <button className="btn btn-primary text-slate-100 w-full xl:w-fit" onClick={()=>signIn(signInWithTwitter)}>
            Twitter account
            <AiOutlineTwitter className="sm:text-2xl"/>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
