// Định nghĩa kiểu cho các hàm setError
type SetErrorFunction = (errorMessage: string) => void;

// Hàm kiểm tra email
const validateEmail = ({
    email,
    setEmailError,
}: {
    email: string;
    setEmailError: SetErrorFunction;
}): void => {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email && !email.match(emailRegex)
        ? setEmailError('Email not valid')
        : setEmailError('');
};

// Hàm kiểm tra số điện thoại
const validatePhone = ({
    phone,
    setPhoneError,
}: {
    phone: string;
    setPhoneError: SetErrorFunction;
}): void => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    phone && !phone.match(phoneRegex)
        ? setPhoneError('Phone Number not valid')
        : setPhoneError('');
};

// Hàm kiểm tra tên đầy đủ
const validateFullName = ({
    fullName,
    setFullNameError,
}: {
    fullName: string;
    setFullNameError: SetErrorFunction;
}): void => {
    fullName && fullName.length < 5
        ? setFullNameError('Full name is too short')
        : fullName && fullName.length > 50
            ? setFullNameError('Try to make short and meaningful')
            : setFullNameError('');
};

const validateMessage = ({
    message,
    setMessageError,
}: {
    message: string;
    setMessageError: SetErrorFunction;
}): void => {
    message && message.length < 5
        ? setMessageError('Message is too short')
        : message && message.length > 200
            ? setMessageError('Try to make short and meaningful')
            : setMessageError('');
};

export { validateEmail, validateFullName, validateMessage, validatePhone };
