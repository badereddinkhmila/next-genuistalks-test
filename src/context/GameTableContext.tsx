"use client"

import { auth } from "@/config/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react"
import { joinPockerTable } from "@/config/Firestore";
import { IUser } from "./AuthentificationContext";
import { DocumentData, DocumentReference, Timestamp, Unsubscribe, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";

const GameTableContext = createContext({} as IContext);
interface Props {
    children: React.ReactNode
}

export interface IPlayer {
    player:string
    note: number
}

export interface ISession {
    user: IUser
    tablePlace:string
    joinedAt: Timestamp
}

interface IContext {
    table: IPlayer[]
    sessions: ISession[]
    tableRef: DocumentReference<DocumentData, DocumentData> | undefined
}

export const GameTableContextProvider = ({children}:Props) => {
    const [table, setTable] = useState<IPlayer[]>([]);
    const [tableRef, setTableRef] = useState<DocumentReference<DocumentData, DocumentData>>();
    const [sessions, setSessions] = useState<ISession[]>([]);

    useEffect(() => {
        let unsubSession:Unsubscribe|undefined;
        let unsubTable:Unsubscribe|undefined;

        const unsubAuth = onAuthStateChanged(auth, async(user) => {

            const { tableSnapshot, sessionsSnapshot } = await joinPockerTable(user);
            if (tableSnapshot && sessionsSnapshot){
                unsubSession = onSnapshot(sessionsSnapshot.query, (snapshot): void => {
                    snapshot.docChanges().forEach((change)=> setSessions(snapshot.docs.map( doc => doc.data() as ISession )));
                })

                unsubTable = onSnapshot(tableSnapshot.query, (snapshot) => {
                    const keys  = Object.keys(snapshot.docs[0].data()).reverse()
                    const values = Object.values(snapshot.docs[0].data()).reverse()
                    const resultTable = keys.map((k, idx)=>  ({player: k, note: values[idx]} as IPlayer))
                    .sort(( a, b )=> (a.player.localeCompare(b.player)));
                    snapshot.docChanges().forEach((change)=> {
                        if (change.type == 'modified') {
                            // @ts-ignore
                            const oldSnapShotData:any[] = Object.entries(snapshot._snapshot.oldDocs.sortedSet.root.key.data.value.mapValue.fields)
                            const changedElement = oldSnapShotData.find((element) => {
                                return parseInt(element[1].integerValue) != resultTable.findLast((val)=> val.player == element[0])?.note
                            });
                            const updatedField = resultTable[parseInt(changedElement[0].slice(6,7))-1]
                            toast.success(`Player n° ${updatedField.player.slice(6,7)} updated his note from ${parseInt(changedElement[1].integerValue)} to ${updatedField.note} !`);
                        }
                    })
                    setTable(resultTable);
                })
                setTableRef(tableSnapshot.docs[0].ref)
            }
        })

        return () => {
            if(unsubSession && unsubTable) {
                unsubSession();
                unsubTable();
            }
            unsubAuth();
        };
    }, []);

    return (
        <GameTableContext.Provider value={{ table, sessions, tableRef }}>
            { children }
        </GameTableContext.Provider>
    );
}

export const UseGameTableContext = () => {
    return useContext(GameTableContext);
}
