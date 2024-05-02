import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useState, useEffect } from 'react'

import { getAddresses } from "@/lib/utils"

import { Loader2 } from "lucide-react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

import { DatePicker } from "antd"
import dayjs from "dayjs"

import { Stepper, Step } from 'react-form-stepper';

const MultiForm = (props) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const onSubmit = props.onSubmit;
    const handleSetOptionClick = props.handleSetOptionClick;
    const setCurrentStep = props.setCurrentStep;
    const setCurrentSubStep = props.setCurrentSubStep;
    const setHasUserNavigatedBack = props.setHasUserNavigatedBack;
    const userIsLoading = props.userIsLoading;

    const formSteps = props.formSteps;
    const form = props.form;
    const formData = props.formData;

    const errors = props.errors;
    const handleSetCheckboxValues = props.handleSetCheckboxValues;
    const currentStep = props.currentStep;
    const currentSubStep = props.currentSubStep;

    const [searchingPostCode, setSearchingPostCode] = useState(false);
    const [addresses, setAddresses] = useState([]);

    const handleSubmit = (values) => {
        onSubmit(values);
        setAddresses([]);
    };

    const handlePostCodeSearch = async (e) => {
        if (searchingPostCode) return;

        if (formSteps[currentStep]?.fields.filter(field => field.step ? field.step === currentSubStep : true)[0].type !== "location") return;

        const searchPostCodeRef = e.target.value

        if (!searchPostCodeRef) {
            if (addresses && addresses.length > 0) {
                setAddresses([]);
            }

            return;
        };

        setSearchingPostCode(true);
        var newAddresses = await getAddresses(searchPostCodeRef);

        if (newAddresses.length > 0) {
            setAddresses(newAddresses);
        }

        setSearchingPostCode(false);
    }

    const handleSetAddress = (e, postCode) => {
        e.preventDefault();

        form.setValue('location', postCode);
        setAddresses([]);
    }

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="max-w-screen-sm mx-auto">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                limit={3}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                stacked={true}
            />

            <div className='mx-5'>
                <Stepper className="flex flex-wrap justify-center items-center mt-5 mb-20" hideConnectors={windowWidth <= 640 ? 'inactive' : false} activeStep={currentStep} steps={formSteps[currentStep]?.name}>
                    {formSteps.map((step, index) => (
                        <Step key={index} label={step.name} />
                    ))}
                </Stepper>

                <div className="flex justify-center items-center mb-64">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            onChange={(e) => handlePostCodeSearch(e)}
                            className="w-[400px] max-sm:w-[370px] space-y-5">

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
                                                            stepField.type === "location" ?
                                                                <FormItem key={`formItem-location-${index}`}>
                                                                    <FormLabel>{stepField.label} {!stepField.optional ? <span className='text-red-500'>*</span> : ''}</FormLabel>
                                                                    <FormControl>
                                                                        <>
                                                                            <Input type="text" placeholder={stepField.placeholder} {...field} />

                                                                            {addresses.length > 0 && (
                                                                                addresses.map((address, index) => {
                                                                                    const { post_code, postal_town, formatted_address } = address;

                                                                                    return (
                                                                                        <div key={index} className="flex items-center justify-center w-full h-12 rounded-lg mb-2 last:mb-0" onClick={(e) => handleSetAddress(e, post_code)}>
                                                                                            <Button className="text-center w-full h-full">{post_code} - {formatted_address}</Button>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            )}
                                                                        </>
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
                                            (userIsLoading || searchingPostCode) ?
                                                <Button disabled ><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
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
                                    (userIsLoading || searchingPostCode) ?
                                        <Button disabled ><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
                                        :
                                        currentStep === formSteps.length ?
                                            <Button disabled ><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>
                                            :
                                            formSteps[currentStep]?.fields.filter(field => field.step ? field.step === currentSubStep : true).some(field => field.type !== "button") ?
                                                (addresses && addresses.length > 0 && searchingPostCode) ?
                                                    <Button disabled >Searching for Postcode</Button>
                                                    :
                                                    <Button type="submit"> {(currentStep !== formSteps.length - 1 || currentSubStep !== Math.max(...formSteps[currentStep - 1].fields.map(field => field.step || 1))) ? "Next" : "Submit"} </Button>
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