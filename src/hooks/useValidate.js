import {useState} from "react";

export const useValidate = (initial) => {
    const [value, setValue] = useState(initial);

    const isValid = (value) => {
        return (/^\d*[.]?\d{0,2}$/gi).test(value);
    }
    const onSetValue = (value) => {
        if(isValid(value))
            setValue(value);
    }
    return [value, onSetValue];
}