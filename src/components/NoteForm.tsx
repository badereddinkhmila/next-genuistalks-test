import { updatePlayerNote } from '@/config/Firestore';
import { UserAuth } from '@/context/AuthentificationContext';
import { IPlayer } from '@/context/GameTableContext';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import React, { ChangeEvent, FormEvent, ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { CiCircleRemove, CiEdit } from "react-icons/ci";

interface Props {
    tablePlace: IPlayer
    tableRef: DocumentReference<DocumentData, DocumentData> | undefined
}

const NoteForm = forwardRef(function NoteForm (props:Props, ref:ForwardedRef<HTMLDialogElement>) {
    const { tablePlace } = props
    const { user } = UserAuth()

    const [formNote, setFormNote] = useState<number>(0);
    const [formError, setFormError] = useState<string>('')
    const close = useRef<HTMLButtonElement|null>(null)

    // Presvent uncontrolled input value
    useEffect(()=> {
        if(tablePlace.note >= 0) setFormNote(tablePlace.note);
    }, [tablePlace.note])

    // Submit form
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
            try {
                await updatePlayerNote(user.uid, formNote)
                clearForm(formNote)
            } catch(error) {}
    }

    // Handle & Validate input changes
    const handleChange= (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) | NaN
        if (!value) {
            setFormNote(0)
            return
        }
        if (value < 0) {
            setFormError('Note value is a positive number !')
            setFormNote(value)
            return;
        }
        setFormNote(value)
        setFormError('')
    }

    const clearForm = (note:number) => {
        setFormError('')
        setFormNote(note)
        if(close.current) close.current.click()
    }

  return (
    <dialog className="modal" ref={ref}>
        <div className="modal-box">
            <div className="flex items-baseline justify-between w-full">
            <h3 className="font-bold text-xl">Change your note!</h3>
            <form method="dialog">
                <button className='btn btn-circle btn-sm btn-active btn-ghost' ref={close} onClick={() => clearForm(0)}>
                    <CiCircleRemove className='text-2xl'/>
                </button>
            </form>
            </div>
            <form className='flex flex-col my-10 space-y-10' onSubmit={handleSubmit}>
                <label className="form-control w-full">
                    <div aria-required='true' className="label required:after:content-['*'] required:after:text-red-400">
                        <span className="label-text">Enter a note</span>
                    </div>
                    <input name='note' onChange={handleChange} type="number" min={0} placeholder='Enter a note...' required value={formNote} className="input input-bordered w-full" />
                    { formError &&
                    <div className="label">
                        <span className="label-text-alt text-error text-xs">{formError}</span>
                    </div>}
                </label>
                <button type='submit' className='btn btn-accent' disabled={!!formError}>Update <CiEdit className='text-xl'/></button>
            </form>
        </div>
    </dialog>
  )
})

export default NoteForm
