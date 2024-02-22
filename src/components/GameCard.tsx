import { IPlayer, ISession } from "@/context/GameTableContext";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { UserAuth } from "@/context/AuthentificationContext";

interface Props {
    index:number
    tablePlace: IPlayer
    session: ISession|undefined
    edit: (tablePlace:IPlayer) => void
}
const GameCard = (props: Props) => {
    const colors = [' bg-pink-300 border-pink-300 ', ' bg-blue-300 border-blue-300 ', ' bg-yellow-400 border-yellow-400 ', ' bg-gray-400 border-gray-400 ', ' bg-red-300 border-red-300 ']
    const {session, tablePlace, index, edit } = props;
    const { user } = UserAuth()
    return (<>
        <div className={colors[index] +' w-full h-64 flex flex-col justify-between rounded-lg border mb-6 py-5 px-4'}>
            <div>
                <h4 className="text-gray-800 font-bold mb-3">
                    Table place n°{tablePlace.player.slice(6,7)}
                </h4>
                <p className="text-gray-800 text-7xl text-center font-extrabold">
                    {tablePlace.note}
                </p>
            </div>
            <div>
                <div className="mb-3 flex items-center flex-no-wrap">
                    <div className=" w-12 h-12 rounded-full">
                    {session?.user ? (
                        session.user.photoURL ? (
                            <div className="w-10 rounded-full">
                                <img src={session.user.photoURL} alt="#" className="overflow-hidden object-cover rounded-full border-2 dark:border-gray-700 shadow"/>
                            </div>):
                        ( session.user.displayName &&
                        <div className="flex justify-center items-center bg-neutral text-neutral-content w-10 rounded-full border-2  dark:border-gray-700 shadow">
                            <p className="text-3xl">
                                { session.user.displayName[0].toUpperCase() }
                            </p>
                        </div>)
                    ) : (
                        <div className="flex justify-center items-center bg-neutral text-neutral-content w-10 rounded-full border-2  dark:border-gray-700 shadow">
                            <p className="text-3xl">
                                N
                            </p>
                        </div>
                    )}
                    </div>
                </div>
                <div className="flex items-center justify-between text-gray-800">
                    <p className="text-sm">
                        { session ? 'Joined at '+session.joinedAt.toDate().toLocaleTimeString() : 'Waiting for a player...'}
                    </p>
                    <button
                        disabled={ session?.user.uid !== user.uid }
                        className="w-8 h-8 cursor-pointer disabled:cursor-not-allowed rounded-full bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-800 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black"
                        aria-label="edit note"
                        role="button"
                        onClick={()=> edit(tablePlace)}
                    >
                        <CiEdit className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default GameCard;
