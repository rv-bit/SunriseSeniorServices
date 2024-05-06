const formSteps = {
    'Account Type': [
        {
            name: 'option_helper',
            label: 'Find Job',
            type: 'selector',
        },
        {
            name: 'option_requester',
            label: 'Find Care',
            type: 'selector',
        },
    ],

    'Age': [
        {
            name: 'option_age_user',
            label: 'Birth date',
            type: 'date',
        }
    ],

    'About': [
        {
            name: 'option_about',
            label: 'About',
            type: 'textarea',
        }
    ],
}

export default formSteps;