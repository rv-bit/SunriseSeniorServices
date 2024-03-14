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
            title: z.string().nonempty('Title is required').min(5, 'Title is too short').max(100, 'Title is too long'),
            description: z.string().nonempty('Description is required').min(25, 'Description is too little').max(250, 'Description is too long'),
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
                currency: true,
                step: 1,
            },

            {
                name: 'option_once',
                label: 'Once',
                type: 'button',
                step: 2,
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
                name: 'work_hours',
                label: 'Work Hours',
                placeholder: 'Enter the hours of the job',
                description: 'This is the hours of the job listing. Max 250 characters.',
                type: 'text',

                step: 3,
            },

            {
                name: 'days',
                label: 'Work Days',
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

                step: 4,
            },
        ],

        validationSchema: z.object({
            payment: z.string().nonempty('Payment is required'),
            work_hours: z.string().nonempty('Work hours is required'),

            days: z.union([z.array(z.string()), z.string()]),

            option_once: z.string(),
            option_hourly: z.string(),
            option_daily: z.string(),
            option_weekly: z.string(),
            option_monthly: z.string(),
        }),

        refineData: [
            {
                key: "payment",
                func: (data) => {
                    return data.payment > 0;
                },
                message: "Payment must be greater than 0.",
                path: ["payment"],
            },

            {
                key: "work_hours",
                func: (data) => {
                    return data.work_hours.length > 0;
                },
                message: "Work hours must be at least an hour.",
                path: ["work_hours"],
            },

            {
                key: "days",
                func: (data) => {
                    return data.days.length > 0;
                },

                message: "Days must be selected.",
                path: ["days"],
            }
        ],

        stepsNames: {
            1: "payment",
            2: "payment_type",
            3: "work_days",
        },
    },
    {
        name: "Additional Information",
        fields: [
            {
                name: 'start_date',
                label: 'Start Date',
                placeholder: 'mm/dd/yyyy',
                description: 'This is the start date of the job listing.',
                type: 'date',
                step: 1
            },
            {
                name: 'additional_information',
                label: 'Extra Information',
                placeholder: 'Enter any extra information',
                description: 'This is the extra information of the job listing. Max 250 characters.',
                type: 'textarea',
                optional: true,
                step: 2,
            },
        ],

        validationSchema: z.object({
            start_date: z.string().nonempty('Date of birth must be in the format mm/dd/yyyy.,'),

            additional_information: z.optional(z.string().max(250, 'Additional information is too long.'))
        }),

        refineData: [
            {
                key: "start_date",
                func: (data) => {
                    const date = new Date(data.start_date);
                    date.setHours(0, 0, 0, 0);

                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);

                    return date >= currentDate;
                },
                message: "Start date must be in the future.",
                path: ["start_date"],
            },
        ]
    }
];

export default formSteps;