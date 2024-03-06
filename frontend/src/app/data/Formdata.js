import { z } from 'zod';

const formSteps = [
    {
        name: "Account Information",
        fields: [
            {
                name: 'email',
                label: 'Email',
                placeholder: 'email@gmail.com',
                description: 'Your email',
                type: 'email',
            },
        ],

        validationSchema: z.object({
            email: z.string().email({
                message: "Must be a valid email address.",
            }),
        }),
    },
    {
        options: true,
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
                label: 'Child Care',
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

        stepsNames: {
            1: "account_type",
            2: "preferences",
        },

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
                name: 'first_name',
                label: 'First Name',
                placeholder: 'shadcn',
                description: 'Name',
                step: 1,
            },
            {
                name: 'last_name',
                label: 'Last Name',
                placeholder: 'shadcn',
                description: 'Last Name',
                step: 1,
            }
        ],

        validationSchema: z.object({
            first_name: z.string().min(5, {
                message: "First name must be at least 5 characters.",
            }),
            last_name: z.string().min(5, {
                message: "Last name must be at least 5 characters.",
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
                step: 1,
                type: 'password',
            },
            {
                name: 'password2',
                label: 'Password Confirmation',
                placeholder: '',
                description: 'Your password Confirmation',
                step: 1,
                type: 'password',
            },
        ],

        validationSchema: z.object({
            password: z.string().min(6, {
                message: "Password must be at least 6 characters.",
            }),
            password2: z.string().min(6, {
                message: "Password must be at least 6 characters.",
            })
        }),

        refineData: {
            func: (data) => data.password === data.password2,
            message: "Passwords must match.",
            path: ["password2"],
        },
    }
]

export default formSteps;