import { DocumentData, DocumentReference, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { firestore } from "./Firebase";
import toast from "react-hot-toast";
import { IPlayer, ISession } from "@/context/GameTableContext";
import { UserCredential } from "firebase/auth";

export const createUserProfileDocument = async (userAuth:any, additionalData:any = {}) => {
    if (!userAuth) return;

    const userRef = doc(firestore, `users/${userAuth.uid}`);
    const snapShot = await getDoc(userRef);
    if (!snapShot.exists()) {
        const { displayName, photoURL, email } = userAuth
        try {
            await setDoc(userRef, {
                displayName: displayName,
                photoURL: photoURL,
                email:email,
                createdAt: new Date(),
                ...additionalData
            })
        } catch (error) {
            console.log(error)
            toast.error('Error creating user profile!')
        }
    }
    return userRef;
}

export interface IJoinFn {
    tableSnapshot: QuerySnapshot<DocumentData, DocumentData>
    sessionsSnapshot: QuerySnapshot<DocumentData, DocumentData>
    userSessionSnapshot: QuerySnapshot<DocumentData, DocumentData>
}

export const joinPockerTable = async (userAuth:any): Promise<IJoinFn>=> {
    if (!userAuth) return {} as IJoinFn;

    const tableRef = collection(firestore, 'PockerPlanning');
    const sessionRef = collection(firestore, 'Session');
    const tableSnapshot = await getDocs(tableRef);
    const sessionsSnapshot = await getDocs(sessionRef);
    const userSessionQuery = query(sessionRef, where("user.uid", "==", userAuth.uid));
    const userSessionSnapshot = await getDocs(userSessionQuery);

    if (tableSnapshot.size === 1 && userSessionSnapshot.size === 0 && sessionsSnapshot.size < 5) {
        const allTablePlaces = Object.keys(tableSnapshot.docs[0].data());
        const reservedTablePlaces = sessionsSnapshot.docs.map(session => session.data().tablePlace);
        const availbleTablePlace = allTablePlaces.filter(places=> reservedTablePlaces.indexOf(places) == -1).sort((a,b)=> (a.localeCompare(b)))[0];
        const { uid, displayName, photoURL, email } = userAuth;

        try {
            await addDoc(sessionRef, { user :{
                uid: uid,
                displayName: displayName,
                photoURL: photoURL,
                note:email,
            }, tablePlace: availbleTablePlace, joinedAt: new Date()});
            toast.success(`Joining the game table at place n°${availbleTablePlace.slice(6,7)} !`)
        } catch (error) {
            console.log(error)
            toast.error('Error joining the game table sit and watch please!');
        }

    } else if (tableSnapshot.size === 1 && userSessionSnapshot.size === 0 && sessionsSnapshot.size == 5) toast.error('Game table is full, sit and watch please!');

    return {tableSnapshot, sessionsSnapshot, userSessionSnapshot};
}

export const exitPockerTable = async (userAuth:any) => {
    if (!userAuth) return;

    const sessionRef = collection(firestore, 'Session');
    const userSessionQuery = query(sessionRef, where("user.uid", "==", userAuth.uid));
    const userSessionSnapshot = await getDocs(userSessionQuery);

    if (userSessionSnapshot.size === 1) {
        try {
            await deleteDoc(userSessionSnapshot.docs[0].ref);
            toast.success(`Leaving place n°${userSessionSnapshot.docs[0].data().tablePlace.slice(6,7)} at the game table !`)
        } catch (error) {
            console.log(error)
            toast.error('Error joining the game table sit and watch please!');
        }

    }
    return collection(firestore, 'PockerPlanning');
    ;
}

// Update a user's table note
export const updatePlayerNote = async (userUID: string, newNote:number) => {
    const tableRef = (await getDocs(collection(firestore, 'PockerPlanning'))).docs[0].ref
    const userSessionQuery = query(collection(firestore, 'Session'), where("user.uid", "==", userUID));
    const userSessionSnapshot = (await getDocs(userSessionQuery)).docs[0]?.data() as ISession;

    if (!userSessionSnapshot || !tableRef ) return;

    const payload = {} as any
    payload[userSessionSnapshot.tablePlace] = newNote
    try {
        await updateDoc(tableRef, payload);
        } catch (error) {
        console.log(error)
        toast.error('Error joining the game table sit and watch please!');
    }
}
