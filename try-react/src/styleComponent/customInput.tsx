import React, { forwardRef } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';

interface CustomTextFieldProps {
    label: string;
    required?: boolean;
    type?: string;
    name?:string;
    value?:string|undefined;
    onChange?:any;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    inputRef?: React.Ref<HTMLInputElement>;
}

const CustomTextField = forwardRef<HTMLInputElement, CustomTextFieldProps>(
    ({label, required, type = "text",onChange, value, startAdornment, endAdornment, ...props },ref) => {
        return (
            <Box sx={{ mb: 1 }}>
                <TextField
                    fullWidth
                    inputRef={ref}
                    label={label}
                    variant="outlined"
                    required={required}
                 
                    type={type}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {startAdornment}
                            </InputAdornment>
                        ),
                        endAdornment: endAdornment,
                       // הגדרת גובה מותאם אישית
                    }}
                    {...props}
                />
            </Box>
        );
    }
);

export default CustomTextField;
