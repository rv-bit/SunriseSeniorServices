import { z } from 'zod';

const formSteps = [
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
            },
            {
                name: 'phone',
                label: 'Phone',
                placeholder: '1234567890',
                description: 'Your phone number',
                step: 1,
            },

            {
                name: 'dob',
                label: 'Date of Birth',
                placeholder: 'mm/dd/yyyy',
                description: 'Your date of birth',
                step: 2,
                type: 'date',
            }
        ],

        validationSchema: z.object({
            first_name: z.string().min(5, {
                message: "First name must be at least 5 characters.",
            }),
            last_name: z.string().min(5, {
                message: "Last name must be at least 5 characters.",
            }),
            phone: z.string(),
            dob: z.string().min(10, {
                message: "Date of birth must be in the format mm/dd/yyyy.",
            })
        }),

        refineData: [
            {
                key: "last_name",

                func: (data) => data.last_name !== data.first_name,
                message: "First and last name must be different.",
                path: ["last_name"],
            },
            {
                key: "phone",

                func: (data) => data.phone.length === 10 && !isNaN(data.phone) || data.phone.length === 11,
                message: "Phone number must be 10 digits.",
                path: ["phone"],
            },
            {
                key: "dob",

                func: (data) => {
                    const dob = new Date(data.dob);
                    const now = new Date();
                    const age = now.getFullYear() - dob.getFullYear();
                    if (age < 18) {
                        return { valid: false, message: "You must be at least 18 years old." }
                    }
                    if (age > 99) {
                        return { valid: false, message: "Are you human?" }
                    }

                    return { valid: true, message: "" }
                },
                path: ["dob"],
            }
        ],
    }
]

export default formSteps;