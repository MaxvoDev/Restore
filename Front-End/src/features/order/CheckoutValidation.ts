import * as yup from 'yup';

export const validationSchema = [
    yup.object({
        fullName: yup.string().required('Full name is required'),
        address1: yup.string().required('Address line 1 is required'),
        address2: yup.string().required('Address line 2 is required'),
        city: yup.string().required('City is required'),
        state: yup.string().required('State is required'),
        zip: yup.number().required('Zip is required'),
        country: yup.string().required('Country is required')
    }),
    yup.object({}),
    yup.object({
        cardName: yup.string().required('Card Name is required'),
        cardNumber: yup.number().required('Card Number is required'),
        expDate: yup.date().required('Expire Date is required'),
        cvv: yup.number().required('CVV is required')
    })
]