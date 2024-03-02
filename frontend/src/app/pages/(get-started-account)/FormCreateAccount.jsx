import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSteps = [
    {
        name: "Welcome, tell us about yourself",
        fields: [
            {
                name: 'option_helper',
                label: 'Find Job',
                step: 1,
                type: 'button',
            },
            {
                name: 'option_requester',
                label: 'Find Care',
                step: 1,
                type: 'button',
            },

            {
                name: 'option_childcare',
                label: 'Childcare',
                step: 2,
                type: 'button',
            },
            {
                name: 'option_seniorcare',
                label: 'Senior Care',
                step: 2,
                type: 'button',
            },
            {
                name: 'option_petcare',
                label: 'Pet Care',
                step: 2,
                type: 'button',
            },
        ],

        validationSchema: z.object({
            option_helper: z.string(),
            option_requester: z.string(),

            option_childcare: z.string(),
            option_seniorcare: z.string(),
            option_petcare: z.string(),
        }),
    },
    {
        name: "Personal Information",
        fields: [
            {
                name: 'username',
                label: 'Username',
                placeholder: 'shadcn',
                description: 'Your username is public',
                step: 1,
            },
            {
                name: 'first_name',
                label: 'First Name',
                placeholder: 'shadcn',
                description: 'Name',
                step: 2,
            },
            {
                name: 'last_name',
                label: 'Last Name',
                placeholder: 'shadcn',
                description: 'Last Name',
                step: 2,
            }
        ],

        validationSchema: z.object({
            username: z.string().min(2, {
                message: "Username must be at least 2 characters.",
            }),
            first_name: z.string().min(2, {
                message: "First name must be at least 2 characters.",
            }),
            last_name: z.string().min(2, {
                message: "Last name must be at least 2 characters.",
            }),
        }),
    },
    {
        name: "Account Information",
        fields: [
            {
                name: 'email',
                label: 'Email',
                placeholder: 'email@gmail.com',
                description: 'Your email',
            },
        ],

        validationSchema: z.object({
            email: z.string().email({
                message: "Must be a valid email address.",
            }),
        }),
    },
    {
        name: "Security Information",
        fields: [
            {
                name: 'password',
                label: 'Password',
                placeholder: 'password',
                description: 'Your password',
            },
        ],

        validationSchema: z.object({
            password: z.string().min(6, {
                message: "Password must be at least 6 characters.",
            }),
        }),
    },
]

const defaultValues = formSteps.reduce((values, step) => {
  step.fields.forEach(field => {
    values[field.name] = '';
  });
  return values;
}, {});

export const FormCreateAccount = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [currentSubStep, setCurrentSubStep] = useState(1);
    
    const [formData, setFormData] = useState({});
    const [formDataOptions, setFormDataOptions] = useState({});

    const [hasUserNavigatedBack, setHasUserNavigatedBack] = useState(false);
    const [errors, setErrors] = useState(null);
    
    const form = useForm({defaultValues});

    useEffect(() => {
        if (currentStep === formSteps.length) {
            console.log('submit', formData);
            navigate('/login')
            return;
        } else if (currentStep > 0 || currentSubStep > 1) {
            const nextFieldNames = formSteps[currentStep]?.fields
                .filter(field => field.step ? field.step === currentSubStep : true)
                .map(field => field.name);

            nextFieldNames.forEach(fieldName => {
                form.setValue(fieldName, '');
            });
        }
    }, [formData]);

    const handleSetOptionClick = (optionName, step) => {    
        console.log('optionName', optionName, step);

        setFormDataOptions(prevState => {
            // Get the keys of the options that belong to the same step
            const sameStepKeys = Object.keys(prevState).filter(key => {
                const optionStep = formSteps[currentStep]?.fields.find(option => option.name === key)?.step;
                console.log('optionStep', optionStep, optionStep === step);
                return optionStep === step;
            });

            // Remove the options that belong to the same step
            const newState = { ...prevState };
            sameStepKeys.forEach(key => {
                console.log('key', key);

                delete newState[key]
            });

            // Add the new option
            newState[optionName] = true;

            return newState;
        });
    };

    const onSubmit = (data) => {
        const dataWithoutOptionKeys = Object.keys(data)
            .filter(key => !key.includes('option_'))
            .reduce((result, key) => {
                result[key] = data[key];
                return result;
            }, {});

        const formDataWithOption = { ...dataWithoutOptionKeys, options: formDataOptions };

        const currentFields = formSteps[currentStep].fields.filter(field => field.step ? field.step === currentSubStep : true);
        const currentValidationSchema = z.object(currentFields.reduce((schema, field) => {
            schema[field.name] = formSteps[currentStep].validationSchema.shape[field.name];
            return schema;
        }, {}));
        
        const result = currentValidationSchema.safeParse(data);

        if (!result.success) {
            const errorMessages = result.error.formErrors.fieldErrors;
            setErrors(errorMessages);
            return;
        }
        
        const allFieldsFilled = formSteps[currentStep].fields
            .filter(field => field.step ? field.step === currentSubStep : true)
            .every(field => data[field.name]);
        const hasButton = formSteps[currentStep].fields
            .filter(field => field.step ? field.step === currentSubStep : true)
            .some(field => field.type === "button");

        if (allFieldsFilled || hasButton) {
            setFormData(prevData => {
                const updatedData = { ...prevData, ...formDataWithOption };
                return updatedData;
            });

            if (formSteps[currentStep].fields.some(field => field.step === currentSubStep + 1)) {
                // If there are more sub-steps, go to the next sub-step
                setCurrentSubStep(currentSubStep + 1);
            } else {
                // If there are no more sub-steps, go to the next step and reset currentSubStep
                setCurrentStep(currentStep + 1);
                setCurrentSubStep(1);
            }
        }
    }

    useEffect(() => {
        setPreviousValuesOnBack();
    }, [currentStep, currentSubStep]);

    const setPreviousValuesOnBack = () => {
        const prevFieldNames = formSteps[currentStep]?.fields
            .filter(field => field.step ? field.step === currentSubStep : true)
            .map(field => field.name)
            .filter(name => !name.startsWith('option_'));

        if (prevFieldNames) {
            prevFieldNames.forEach(fieldName => {
                const fieldValue = formData[fieldName];
                form.setValue(fieldName, fieldValue);
            });
        }
    }

    return (
        <div className="max-w-screen-sm mx-auto">
            <h1 className="text-center">Creating Account</h1>
            
            <div className="flex justify-center items-center mt-64 mb-64">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-5">
                        <h2 className='text-center'>{formSteps[currentStep]?.name}</h2>
                        {formSteps[currentStep]?.fields.filter(field => field.step ? field.step === currentSubStep : true).map((stepField, index) => {
                            return (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={stepField.name}
                                    render={({ field }) => (
                                        stepField.type === "button" ?
                                            <FormItem key={index}>
                                                <div type="button" className="bg-[#fffff] text-black font-medium rounded-lg px-5 py-4 border-2 border-black border-opacity-50 cursor-pointer transition-all hover:bg-[#dbd8d0] hover:backdrop-blur-[40px] hover:rounded-lg w-full text-left"
                                                    onClick={() => {
                                                        handleSetOptionClick(stepField.name, currentSubStep);
                                                        form.handleSubmit(onSubmit)();
                                                    }}>

                                                    {stepField.label}
                                                </div>
                                            </FormItem>
                                        :
                                            <FormItem key={index}>
                                                <FormLabel>{stepField.label}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={stepField.placeholder} {...field} />
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
                                (currentStep !== 0 || currentSubStep > 1) && (
                                    <Button type="button" onClick={() => {
                                        if (currentSubStep > 1) {
                                            setCurrentSubStep(currentSubStep - 1);
                                            setHasUserNavigatedBack(true);
                                        } else if (currentStep > 0) {
                                            setCurrentStep(currentStep - 1);

                                            // Find the maximum sub-step of the previous step
                                            const maxSubStep = Math.max(...formSteps[currentStep - 1].fields.map(field => field.step || 1));
                                            setCurrentSubStep(maxSubStep);

                                            setHasUserNavigatedBack(true);
                                        }
                                    }}>Back</Button>
                                )
                            }

                            {!formSteps[currentStep]?.fields.some(field => field.type === "button") && (
                                <Button type="submit"> { (currentStep !== formSteps.length - 1) ? "Next" : "Submit" } </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
};