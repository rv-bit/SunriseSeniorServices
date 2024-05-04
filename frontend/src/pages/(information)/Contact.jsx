import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import React, { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

import PagesData from '@/data/PagesData';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';

const formDataInputs = [
    {
        name: 'emailFrom',
        label: 'Email From',
        placeholder: 'Enter the email',
        optional: false,
        type: 'email',
    },
    {
        name: 'emailFromName',
        label: 'From Name',
        placeholder: 'Enter the name',
        optional: false,
        type: 'text',
    },
    {
        name: 'emailTo',
        label: 'Email To',
        placeholder: 'Enter the email',
        optional: false,
        info: 'Click on a team member to send an email',
        type: 'email',
    },
    {
        name: 'subject',
        label: 'Subject',
        placeholder: 'Enter the subject',
        optional: false,
    },
    {
        name: 'messageBody',
        label: 'Message',
        placeholder: 'Enter the message',
        optional: false,
        type: 'textarea',
    },
];

const Contact = () => {
    const navigate = useNavigate();

    const [errors, setErrors] = useState(null);

    const form = useForm({
        defaultValues: {
            emailFrom: '',
            emailFromName: '',
            emailTo: '',
            messageBody: '',
            subject: '',
        },
    });
    const formRef = useRef();

    const onSubmit = (event, data) => {
        event.preventDefault();

        let currentValidationSchema = z.object({
            subject: z.string().nonempty('Subject is required').min(5, 'Subject is too little').max(50, 'Subject is too long'),
            emailFrom: z.string().email({ message: "Must be a valid email address." }),
            emailFromName: z.string().nonempty('Name is required').min(5, 'Name is too little').max(50, 'Name is too long'),
            emailTo: z.string().email({ message: "Must be a valid email address." }),
            messageBody: z.string().nonempty('Message is required').min(25, 'Message is too little').max(250, 'Message is too long'),
        });

        const validation = currentValidationSchema.safeParse(data);

        if (!validation.success) {
            const errorMessages = validation.error.formErrors.fieldErrors;
            setErrors(errorMessages);

            return "Error";
        }

        if (data.emailFrom === data.emailTo) {
            setErrors({
                emailTo: ['Emails cannot be the same'],
            });

            return "Error";
        }

        const isEmailValid = PagesData.Team.some((teamMember) => teamMember.mail === data.emailTo);
        if (!isEmailValid) {
            setErrors({
                emailTo: ['Email is not valid, please select a team member from the list.'],
            });

            return "Error";
        }

        setErrors(null);

        emailjs
            .sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formRef.current, {
                publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            })
            .then(
                () => {
                    toast.success('Email sent successfully!');
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                },
                (error) => {
                    toast.error('Failed to send email!');
                },
            );

        form.reset();
    }

    return (
        <React.Fragment>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                limit={3}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
                stacked={true}
            />

            <div className='flex flex-col gap-5 items-center justify-center my-5'>

                <div className='w-[500px] max-sm:w-[350px] max-extraSm:w-[260px] h-full'>
                    <h2 className='text-center font-extrabold underline mb-5 text-3xl'>Contact Us</h2>
                    <p className='text-center font-bold mb-5'>Our Managers Email is:A.Ciocan@wlv.ac.uk</p>

                    <Form {...form}>
                        <form ref={formRef} onSubmit={(event) => { onSubmit(event, form.getValues()) }} className="flex flex-col gap-5 items-center justify-center bg-slate-100 bg-opacity-55 rounded-2xl w-full mb-5 p-5">
                            {formDataInputs.map((formDataInput, index) => {
                                return (
                                    <FormField
                                        key={`formField-${index}`}
                                        control={form.control}
                                        name={formDataInput.name}
                                        render={({ field }) => (
                                            <FormItem key={`formItem-input-${index}`} className='w-full'>
                                                <FormLabel>{formDataInput.label} {!formDataInput.optional ? <span className='text-red-500'>*</span> : ''}</FormLabel>

                                                <FormControl>
                                                    {formDataInput.type === 'textarea' ? (
                                                        <Textarea placeholder={formDataInput.placeholder} {...field} />
                                                    ) : (
                                                        <Input type={formDataInput.type || "text"} placeholder={formDataInput.placeholder} {...field} />
                                                    )}
                                                </FormControl>

                                                {formDataInput.info && <FormDescription>{formDataInput.info}</FormDescription>}

                                                {errors && errors[formDataInput.name] && errors[formDataInput.name].map((error, errorIndex) => (
                                                    <FormMessage key={errorIndex}>
                                                        {error}
                                                    </FormMessage>
                                                ))}
                                            </FormItem>
                                        )}
                                    />
                                )
                            })}
                            <Button type='submit' className='w-full bg-slate-600 hover:bg-slate-700 text-white'>Send</Button>
                        </form>
                    </Form>

                    <h2 className='text-center font-extrabold underline text-xl -mb-1'>Our Team</h2>

                    <div className="mt-3 flex justify-center -space-x-2 overflow-hidden">
                        {PagesData.Team && PagesData.Team.map((team, index) => {
                            const { name, mail } = team;
                            const nameInitials = name.split(' ').map((n) => n[0]).join('');

                            return (
                                <div
                                    key={index}
                                    onClick={() => form.setValue('emailTo', mail)}
                                    className='size-12 rounded-full bg-muted flex-shrink-0 text-black flex justify-center items-center hover:cursor-pointer'>{nameInitials}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Contact