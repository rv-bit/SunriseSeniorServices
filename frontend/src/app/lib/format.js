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
                case 'payment_type' || 'payment_amount':
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