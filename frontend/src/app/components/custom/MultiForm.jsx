import { useState, useEffect } from 'react'

import { Notification } from '@/app/components/custom/Notifications' // Custom components

import { Loader2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"

import { Card } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Textarea } from "@/app/components/ui/textarea"

import { DatePicker } from "antd"
import dayjs from "dayjs"

import { Stepper, Step } from 'react-form-stepper';

const MultiForm = ({ onSubmit, handleSetOptionClick, alertHandleClose, setCurrentStep, setCurrentSubStep, setHasUserNavigatedBack, alertState, userIsLoading, currentStep, currentSubStep, formSteps, form, formData, errors, handleSetCheckboxValues }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        <div className="max-w-screen-sm mx-auto">
            {alertState.open && (
                <Notification
                    open={alertState.open}
                    handleClose={alertHandleClose}
                    message={alertState.message}
                />
            )}

            <div className='mx-5'>
                <Stepper className="flex flex-wrap justify-center items-center mt-5 mb-20" hideConnectors={windowWidth <= 640 ? 'inactive' : false} activeStep={currentStep} steps={formSteps[currentStep]?.name}>
                    {formSteps.map((step, index) => (
                        <Step key={index} label={step.name} />
                    ))}
                </Stepper>
                
                <div className="flex justify-center items-center mb-64">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] max-sm:w-[370px] space-y-5">
                            {formSteps[currentStep]?.fields.filter(field => field.step ? field.step === currentSubStep : true).map((stepField, index) => {
                                return (
                                    <FormField
                                        key={`formField-${index}`}
                                        control={form.control}
                                        name={stepField.name}
                                        render={({ field }) => (
                                            stepField.type === "date" ?
                                                <FormItem key={`formItem-date-${index}`}>
                                                    <div className="flex flex-col justify-between gap-2">
                                                    <FormLabel>{stepField.label} {!stepField.optional ? <span className='text-red-500'>*</span> : ''}</FormLabel>
                                                        <FormControl>
                                                            <DatePicker value={formData[stepField.name] ? dayjs(formData[stepField.name]) : "" || ""} onChange={
                                                                (date, dateString) => {                                                            
                                                                    formData[stepField.name] = dateString;
                                                                    form.setValue(stepField.name, dateString);
                                                                }
                                                            } />
                                                        </FormControl>
                                                        <FormDescription>
                                                            {stepField.description}
                                                        </FormDescription>

                                                        {errors && errors[stepField.name] && errors[stepField.name].map((error, errorIndex) => (
                                                            <FormMessage key={errorIndex}>
                                                                {error}
                                                            </FormMessage>
                                                        ))}
                                                    </div>
                                                </FormItem>
                                            :
                                                stepField.type === "textarea" ?
                                                <FormItem key={`formItem-textarea-${index}`}>
                                                    <FormLabel>{stepField.label} {!stepField.optional ? <span className='text-red-500'>*</span> : ''}</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder={stepField.placeholder} {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        {stepField.description}
                                                    </FormDescription>

                                                    {errors && errors[stepField.name] && errors[stepField.name].map((error, errorIndex) => (
                                                        <FormMessage key={errorIndex}>
                                                            {error}
                                                        </FormMessage>
                                                    ))}
                                                </FormItem>
                                            :
                                                stepField.type === "checkbox" ?
                                                <FormItem key={`formItem-checkbox-${index}`}>
                                                    <FormLabel>{stepField.label} {!stepField.optional ? <span className='text-red-500'>*</span> : ''}</FormLabel>
                                                    <div key={`formItem-checkbox-${index}`} className="flex flex-col justify-between gap-2">
                                                        {stepField.options?.map((option, optionIndex) => (
                                                            <FormControl key={`formControl-checkBox-${optionIndex}`}>
                                                                <div>
                                                                    <Checkbox key={optionIndex}
                                                                        className="size-6 align-middle"
                                                                        checked={field.value?.includes(option.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            handleSetCheckboxValues(option.id, checked);
                                                                            return checked
                                                                                ? field.onChange([...field.value, option.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== option.id
                                                                                    )
                                                                            )
                                                                        }}
                                                                    />
                                                                    <FormLabel className='ml-2 text-center text-md font-normal'>{option.id}</FormLabel>
                                                                </div>
                                                            </FormControl>
                                                        ))}
                                                    </div>


                                                    {errors && errors[stepField.name] && errors[stepField.name].map((error, errorIndex) => (
                                                        <FormMessage key={errorIndex}>
                                                            {error}
                                                        </FormMessage>
                                                    ))}
                                                </FormItem>
                                            :
                                                stepField.type === "button" ?
                                                <FormItem key={`formItem-button-${index}`}>
                                                    <div type="button" className="bg-[#fffff] text-black font-medium rounded-lg px-5 py-4 border-2 border-black border-opacity-50 cursor-pointer transition-all hover:bg-[#dbd8d0] hover:backdrop-blur-[40px] hover:rounded-lg w-full text-left"
                                                        onClick={() => {
                                                            handleSetOptionClick(stepField.name, currentSubStep);
                                                            form.handleSubmit(onSubmit)();
                                                        }}>

                                                        {stepField.label}
                                                    </div>
                                                </FormItem>
                                            :
                                                <FormItem key={`formItem-input-${index}`}>
                                                    <FormLabel>{stepField.label} {!stepField.optional ? <span className='text-red-500'>*</span> : ''}</FormLabel>
                                                    <FormControl>
                                                        <div className={`${stepField.currency ? 'input-with-symbol' : ''}`}>
                                                            <Input type={stepField.type || "text"} placeholder={stepField.placeholder} {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        {stepField.description}
                                                    </FormDescription>

                                                    {errors && errors[stepField.name] && errors[stepField.name].map((error, errorIndex) => (
                                                        <FormMessage key={errorIndex}>
                                                            {error}
                                                        </FormMessage>
                                                    ))}
                                                </FormItem>
                                        )}
                                    />
                                )
                            })}
                            
                            <div className='space-x-2'>
                                {
                                    currentStep !== formSteps.length ? 
                                        (currentStep !== 0 || currentSubStep > 1) && (
                                            userIsLoading ?
                                                <Button disabled ><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>
                                            :
                                                <Button type="button" onClick={() => {
                                                    if (currentSubStep > 1) {
                                                        setCurrentSubStep(currentSubStep - 1);
                                                        setHasUserNavigatedBack(true);
                                                    } else if (currentStep > 0) {
                                                        setCurrentStep(currentStep - 1);

                                                        const maxSubStep = Math.max(...formSteps[currentStep - 1].fields.map(field => field.step || 1));
                                                        setCurrentSubStep(maxSubStep);

                                                        setHasUserNavigatedBack(true);
                                                    }
                                                }}>Back</Button>
                                        )
                                    :
                                        null
                                }

                                {
                                    userIsLoading ?
                                        <Button disabled ><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>
                                    :
                                        currentStep === formSteps.length ? 
                                            <Button disabled ><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>
                                        :
                                            formSteps[currentStep]?.fields.filter(field => field.step ? field.step === currentSubStep : true).some(field => field.type !== "button") ?
                                                <Button type="submit"> { (currentStep !== formSteps.length - 1 || currentSubStep !== Math.max(...formSteps[currentStep - 1].fields.map(field => field.step || 1))) ? "Next" : "Submit" } </Button>
                                            :
                                                null
                                }
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default MultiForm