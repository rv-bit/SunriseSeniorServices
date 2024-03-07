import { Suspense, useContext, useState, useEffect, lazy } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import AuthContext from '@/app/context/AuthContext'

import { Post, Get } from '@/app/lib/utils' // Common functions 

import formSteps from '@/app/data/FormSignUp';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MultiForm = lazy(() => import('@/app/components/custom/MultiForm'));

const defaultValues = formSteps.reduce((values, step) => {
    step.fields.forEach(field => {
        values[field.name] = '';
    });
    return values;
}, {});

async function checkAccountUsingEmail(email, alertState, setAlertState) {
    if (!email) return;

    const response = await Post(`${import.meta.env.VITE_API_PREFIX}/signup`, {"checkAccount": true, "email": email});

    if (!response.ok) {
        const data = await response.json();
        setAlertState({ ...alertState, open: true, message: data.Error });
        return false;
    }

    const data = await response.json();
    if (data.accountExistsAlready) {
        setAlertState({ ...alertState, open: true, message: 'An account with this email already exists.' });
        return false;
    }

    return true;
}

async function createUser(formData, alertState, setAlertState) {
    if (!formData) return;

    console.log('formData', formData);

    const response = await Post(`${import.meta.env.VITE_API_PREFIX}/signup`, {formData});
    if (!response.ok) {
        const data = await response.json();
        setAlertState({ ...alertState, open: true, message: data.Error });
        return false;
    }

    const data = await response.json();
    return true;
}

const FormCreateAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {userAuthData, setUserAuth} = useContext(AuthContext);

    const [currentStep, setCurrentStep] = useState(0);
    const [currentSubStep, setCurrentSubStep] = useState(1);
    
    const [formData, setFormData] = useState({});
    const [formDataOptions, setFormDataOptions] = useState({});

    const [hasUserNavigatedBack, setHasUserNavigatedBack] = useState(false);
    const [errors, setErrors] = useState(null);

    const form = useForm({defaultValues});

    useEffect(() => {
        if (userAuthData && userAuthData.length > 0 || userAuthData && userAuthData.isConnected) {
            navigate('/');
            return;
        }

        const informationGiven = location.state?.informationGiven;
        if (informationGiven) {
            const formDataTemp = {
                email: informationGiven.email,
                first_name: informationGiven.given_name,
                last_name: informationGiven.family_name,
            }

            Object.entries(formDataTemp).forEach(([key, value]) => {
                form.setValue(key, value);

                setFormData(prevData => {
                    const updatedData = { ...prevData, [key]: value };
                    return updatedData;
                });
            });

            setCurrentStep(1);
        }

        return () => {};
    }, []);

    const [userIsLoading, setUserLoad] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        message: '',
    });

    const alertHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertState({ ...alertState, open: false });
    }

    useEffect(() => {
        const createUserAndNavigate = async () => {
            if (currentStep === formSteps.length) {
                setUserLoad(true);
                const userCreated = await createUser(formData, alertState, setAlertState);

                setTimeout(() => {
                    if (userCreated) {
                        setUserLoad(false);
                        navigate('/login');
                    } else {
                        setUserLoad(false);
                        navigate('/');
                    }
                }, 2000);

            } else if (currentStep > 0 || currentSubStep > 1) {
                const nextFieldNames = formSteps[currentStep]?.fields
                    .filter(field => field.step ? field.step === currentSubStep : true)
                    .map(field => field.name);

                nextFieldNames.forEach(fieldName => {
                    form.setValue(fieldName, '');
                });
            }
        };

        createUserAndNavigate();
    }, [formData]);

    const handleSetOptionClick = (optionName, subStep) => {    
        setFormDataOptions(prevState => {
            const currentStepOptions = formSteps
                .filter(stepObj => stepObj.fields.some(field => field.step === currentStep))
                .flatMap(stepObj => stepObj.fields)
                .filter(field => field.step === currentSubStep);

            const sameStepKeys = currentStepOptions.map(option => option.name);

            const currentStepBasedOnSubStep = formSteps.find(stepObj => stepObj.fields.some(field => field.step === subStep));
            const stepName = currentStepBasedOnSubStep?.stepsNames?.[subStep];
            if (!stepName) return prevState;

            const newState = { ...prevState };
            if (!newState[stepName]) newState[stepName] = [];

            newState[stepName] = newState[stepName].filter(option => option !== optionName);
            sameStepKeys.forEach(key => {
                newState[stepName].splice(key, 1);
            });

            newState[stepName].push(optionName);

            return newState;
        });
    };

    const moveToNextStep = (data) => {
        const dataWithoutOptionKeys = Object.keys(data)
            .filter(key => !key.includes('option_'))
            .reduce((result, key) => {
                result[key] = data[key];
                return result;
            }, {});

        const formDataWithOptions = { ...dataWithoutOptionKeys, options: formDataOptions };

        const currentFields = formSteps[currentStep].fields.filter(field => field.step ? field.step === currentSubStep : true);
        let currentValidationSchema = z.object(currentFields.reduce((schema, field) => {
            schema[field.name] = formSteps[currentStep]?.validationSchema.shape[field.name];
            return schema;
        }, {}));

        if (formSteps[currentStep]?.refineData) {
            currentFields.forEach(field => {
                const refineObj = formSteps[currentStep].refineData.find(refine => refine.key === field.name);
                if (refineObj) {
                    const result = refineObj.func(data);
                    let isValid;
                    let message;

                    if (typeof result === 'object' && result !== null) {
                        isValid = result.valid;
                        message = result.message;
                    } else {
                        isValid = result;
                        message = refineObj.message;
                    }

                    currentValidationSchema = currentValidationSchema.refine(() => isValid, {
                        message: message,
                        path: refineObj.path,
                    });
                }
            });
        }

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
                const updatedData = { ...prevData, ...formDataWithOptions };
                return updatedData;
            });

            if (formSteps[currentStep].fields.some(field => field.step === currentSubStep + 1)) {
                setCurrentSubStep(currentSubStep + 1);
            } else {
                setCurrentStep(currentStep + 1);
                setCurrentSubStep(1);
            }
        }
    }

    const onSubmit = async (data) => {
        if (formData.email && !data.email) {
            data.email = formData.email;
        }

        console.log('data', data);

        const email = data.email || formData.email;
        if (email && currentStep === 0 && currentSubStep === 1) {
            setUserLoad(true);

            const accountDoesNotExist = await checkAccountUsingEmail(email, alertState, setAlertState);
            if (!accountDoesNotExist) {
                setTimeout(() => {
                    setUserLoad(false);
                    navigate('/login'); 
                }, 2000);
                return;
            }

            setUserLoad(false);
            moveToNextStep(data);
        } else {
            moveToNextStep(data);
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
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
        }>
            <MultiForm
                onSubmit={onSubmit}
                handleSetOptionClick={handleSetOptionClick}
                alertHandleClose={alertHandleClose}
                setCurrentStep={setCurrentStep}
                setCurrentSubStep={setCurrentSubStep}

                alertState={alertState}
                userIsLoading={userIsLoading}

                currentStep={currentStep}
                currentSubStep={currentSubStep}

                formSteps={formSteps}
                form={form}
                formData={formData}
                errors={errors}
            />
        </Suspense>
    )
};

export default FormCreateAccount;