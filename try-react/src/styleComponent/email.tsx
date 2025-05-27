import { useState } from "react";

const MyComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    return (
        <div>
            <SimpleButton onClick={() => setIsOpen(true)}>פתח דיאלוג</SimpleButton>
            <SimpleDialog open={isOpen} onClose={() => setIsOpen(false)} title="כותרת דיאלוג">
                <SimpleInput 
                    value={inputValue} 
                    onChange={(e:any) => setInputValue(e.target?.value)} 
                    placeholder="הזן טקסט" 
                />
                <SimpleTextarea 
                    value={inputValue} 
                    onChange={(e:any) => setInputValue(e.target.value)} 
                    rows={4} 
                />
            </SimpleDialog>
        </div>
    );
};
const SimpleTextarea = ({ value, onChange, rows }:{value:string,onChange:any,rows:any}) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            className="border border-gray-300 p-2 rounded"
        />
    );
};
const SimpleInput = ({ value, onChange, placeholder }:{value:string,onChange:any,placeholder:string}) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="border border-gray-300 p-2 rounded"
        />
    );
};
const SimpleButton = ({ onClick, children }:{onClick:any,children:any}) => {
    return (
        <button onClick={onClick} className="bg-blue-500 text-white px-4 py-2 rounded">
            {children}
        </button>
    );
};
const SimpleDialog = ({ open, onClose, title, children }:{open:boolean,onClose:any,title:string,children:any}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg font-bold">{title}</h2>
                <div>{children}</div>
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    סגור
                </button>
            </div>
        </div>
    );
};

export {MyComponent,SimpleButton,SimpleDialog,SimpleInput,SimpleTextarea};