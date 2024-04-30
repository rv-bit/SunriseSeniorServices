
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const Post = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response;
}

export const Get = async (url, body) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null
    });

    return response;
}

export const Put = async (url, data) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response;
}

export const Delete = async (url, data) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response;
}

export const formatTags = (tags) => {
    let returnTags = {}
    var tagValue = {}

    if (tags) {
        Object.entries(tags).forEach(([key, value]) => {
            tagValue[key] = value

            if (typeof value === 'string') {
                var replacedValue = value.replace('option_', '');
                tagValue[key] = value.includes('option_') ? replacedValue.charAt(0).toUpperCase() + replacedValue.slice(1) : value;
            }

            switch (key) {
                case 'payment_type' && 'payment_amount':
                    returnTags['Tag_Payment'] = "£" + tagValue['payment_amount'] + " / " + tagValue['payment_type']
                    break;
                case 'days':
                    returnTags['Tag_Work_Days'] = tagValue['days'].join(', ')
                    break;
                case 'start_date':
                    const date = new Date(tagValue['start_date']);
                    const currentDate = new Date();

                    const diffTime = Math.abs(date - currentDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 2) {
                        returnTags['Tag_Start_Date'] = "Starts Shortly"
                    } else {
                        returnTags['Tag_Start_Date'] = "Starts on: " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                    }

                    break
                case 'hours':
                    returnTags['Tag_Work_Hours'] = tagValue['hours'] > 0 ? tagValue['hours'] + " Working Hours" : "Flexible Working Hours"
                    break;
                default:
                    returnTags[key] = tagValue[key];
                    break;
            }
        })
    }

    return returnTags;
}

export const formatDate = (date) => {
    const formattedDate = date.replace(/-/g, (match, index, original) => {
        return (original.indexOf(match) === 4 || original.indexOf(match) === 7) ? '-' : ' ';
    }).replace(':', ':');

    const newDate = new Date(formattedDate);
    const currentDate = new Date();

    const newDateDay = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const currentDateDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const diffTime = Math.abs(newDateDay - currentDateDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    var returnDate = "";

    const hours = newDate.getHours() === 0 ? "00" : newDate.getHours().toString().toLocaleString('en-GB', { minimumIntegerDigits: 2, useGrouping: false });
    const minutes = newDate.getMinutes() === 0 ? "00" : newDate.getMinutes().toLocaleString('en-GB', { minimumIntegerDigits: 2, useGrouping: false });

    switch (diffDays) {
        case 0:
            returnDate = "Today at " + hours + ":" + minutes;
            break
        case 1:
            returnDate = "Yesterday at " + hours + ":" + minutes;
            break
        default:
            returnDate = newDate.toDateString();
            break;
    }

    return returnDate;
}

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function splitPostcode(postcode) {
    const match = postcode.match(/^([A-Z0-9]{2,4})([0-9][A-Z]{2})$/i);

    if (!match) {
        return null;
    }

    return {
        outcode: match[1],
        incode: match[2]
    };
}
