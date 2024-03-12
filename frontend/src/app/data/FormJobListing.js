import { z } from 'zod';

const formSteps = [
    {
        name: "General Information",
        fields: [
            {
                name: 'title',
                label: 'Title',
                placeholder: 'Enter the title of the job',
                description: 'This is the title of the job listing. Max 100 characters.',
                type: 'text',
                step: 1,
            },

            {
                name: 'description',
                label: 'Description',
                placeholder: 'Enter the description of the job',
                description: 'This is the description of the job listing. Max 250 characters.',
                type: 'textarea',
                step: 2,
            }
        ],

        validationSchema: z.object({
            title: z.string().nonempty('Title is required'),
            title: z.string().max(100, 'Title is too long'),
            title: z.string().min(5, 'Title is too short'),

            description: z.string().nonempty('Description is required'),
            description: z.string().max(250, 'Description is too long'),
            description: z.string().min(20, 'Description is too short'),
        }),
    },
    {
        name: "Job Details",
        fields: [
            {
                name: 'option_childcare',
                label: 'Child Care',
                step: 1,
                type: 'button',
            },
            {
                name: 'option_seniorcare',
                label: 'Elderly Care',
                step: 1,
                type: 'button',
            },
            {
                name: 'option_petcare',
                label: 'Pet Care',
                step: 1,
                type: 'button',
            },
        ],

        validationSchema: z.object({
            option_childcare: z.string(),
            option_seniorcare: z.string(),
            option_petcare: z.string(),
        }),

        stepsNames: {
            1: "category"
        },
    },

    {
        name: "Payment & Work Days",
        fields: [
            {
                name: 'payment',
                label: 'Payment',
                placeholder: 'Enter the payment for the job',
                description: 'This is the payment for the job listing',
                type: 'number',
                step: 1,
            },

            {
                name: 'option_hourly',
                label: 'Hourly',
                type: 'button',
                step: 2,
            },
            {
                name: 'option_daily',
                label: 'Daily',
                type: 'button',
                step: 2,
            },
            {
                name: 'option_weekly',
                label: 'Weekly',
                type: 'button',
                step: 2,
            },
            {
                name: 'option_monthly',
                label: 'Monthly',
                type: 'button',
                step: 2,

            },

            {
                name: 'days',
                label: 'Days',
                description: 'This is the days of the week the job listing is available. Max 250 characters.',
                type: 'checkbox',

                options: [
                    { id: 'Monday' },
                    { id: 'Tuesday' },
                    { id: 'Wednesday' },
                    { id: 'Thursday' },
                    { id: 'Friday' },
                    { id: 'Saturday' },
                    { id: 'Sunday' },
                ],

                step: 3,
            },
        ],

        validationSchema: z.object({
            payment: z.string().nonempty('Payment is required'),
            payment: z.string().min(1, 'Payment is required'),

            days: z.array(z.string().nonempty('Days is required')),

            option_hourly: z.string(),
            option_daily: z.string(),
            option_weekly: z.string(),
            option_monthly: z.string(),
        }),

        stepsNames: {
            1: "payment",
            2: "payment_type",
            3: "work_days",
        },
    }
];

export default formSteps;