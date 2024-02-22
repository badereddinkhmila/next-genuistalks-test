"use client"
import GameCard from "@/components/GameCard";
import NoteForm from "@/components/NoteForm";
import { IPlayer, UseGameTableContext } from "@/context/GameTableContext";
import { useRef, useState } from "react";

const Home = () => {
    const { table, sessions, tableRef } = UseGameTableContext()
    const modal = useRef<HTMLDialogElement>(null);
    const [tablePlace, setTablePlace] = useState<IPlayer>({} as IPlayer)

    const handleEdit= (tablePlace:IPlayer) => {
        setTablePlace(tablePlace);
        modal.current != null ? modal.current.showModal() : true
    }

    return (
        <div className="mx-auto container py-20 px-6">
            <p className="text-6xl text-center font-mono font-extrabold mb-32">Pocker Table</p>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-20 gap-y-20">
                { table.map((item, index)=>(
                    <GameCard tablePlace={item} index={index} key={index} session={ sessions.find(session => session.tablePlace === item.player) } edit={handleEdit} />))
                }
            </div>
            <NoteForm tableRef={tableRef} ref={modal} tablePlace={tablePlace}/>
        </div>
    );
};

export default Home;
