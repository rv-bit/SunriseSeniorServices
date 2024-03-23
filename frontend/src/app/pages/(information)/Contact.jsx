import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

import PagesData from '@/app/data/PagesData';

import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';

import { Textarea } from '@/app/components/ui/textarea';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"

import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';

const formDataInputs = [
    {
        name: 'emailFrom',
        label: 'Email',
        placeholder: 'Enter the email',
        optional: false,
        type: 'email',
    },
    {
        name: 'emailTo',
        label: 'Email',
        placeholder: 'Enter the email',
        optional: false,
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
            emailTo: '',
            messageBody: '',
            subject: '',
        },
    });

    const onSubmit = async (event, data) => {
        event.preventDefault();

        let currentValidationSchema = z.object({
            subject: z.string().nonempty('Subject is required').min(5, 'Subject is too little').max(50, 'Subject is too long'),
            emailFrom: z.string().email({message: "Must be a valid email address."}),
            emailTo: z.string().email({message: "Must be a valid email address."}),
            messageBody: z.string().nonempty('Message is required').min(25, 'Message is too little').max(250, 'Message is too long'),
        });

        const validation = currentValidationSchema.safeParse(data);

        if (!validation.success) {
            const errorMessages = validation.error.formErrors.fieldErrors;
            setErrors(errorMessages);
            return false;
        }

        setErrors(null);

        return true
    }

    const handleEmailSend = (email) => {
        form.setValue('emailTo', email);
    }

    return (
        <React.Fragment>
            <div className='flex flex-col gap-5 items-center justify-center my-5'>

                <div className='w-[500px] max-sm:w-[350px] max-extraSm:w-[260px] h-full'>
                    <h2 className='text-center font-extrabold underline mb-5 text-3xl'>Contact Us</h2>
                    <p className='text-center font-bold mb-5'>Our Managers Email is:A.Ciocan@wlv.ac.uk</p>

                        <Form {...form}>
                            <form onSubmit={(event) => {
                                    const formSubmittedWithSuccess = onSubmit(event, form.getValues())

                                    if (formSubmittedWithSuccess) {
                                        window.location.href = `mailto:${form.getValues()['emailTo']}?subject=${form.getValues()['subject']}&body=${JSON.stringify(form.getValues()['messageBody'])}`;

                                        form.reset();
                                    }
                                    
                                }} className="flex flex-col gap-5 items-center justify-center bg-slate-100 bg-opacity-55 rounded-2xl w-full mb-5 p-5">
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

                        {/* <div className='flex flex-col gap-2 items-center justify-center w-full'>
                            <Label htmlFor='emailFrom'>Email</Label>
                            <Input type='email' id='emailFrom' name='emailFrom' placeholder='Enter the email' />
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center w-full'>
                            <Label htmlFor='emailTo'>Email</Label>
                            <Input type='email' id='emailTo' name='emailTo' {...formData ? formData.emailTo : ''} />
                        </div>

                        <div className='flex flex-col gap-2 items-center justify-center w-full'>
                            <Label htmlFor='messageBody'>Message</Label>
                            <Textarea id='messageBody' name='messageBody' />
                        </div> */}
                    
                    <h2 className='text-center font-extrabold underline text-xl -mb-1'>Our Team</h2>
                    
                    <div className="mt-3 flex justify-center -space-x-2 overflow-hidden">
                        {PagesData.Team && PagesData.Team.map((team, index) => {
                            const { name, mail } = team;
                            const nameInitials = name.split(' ').map((n) => n[0]).join(''); 
                                
                            return (
                                <div 
                                    key={index}
                                    onClick={() => handleEmailSend(mail)}
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