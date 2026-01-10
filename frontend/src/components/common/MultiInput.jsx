import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const MultiInput = ({ label, values = [], onChange, placeholder = "Add item..." }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim()) {
            onChange([...values, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemove = (index) => {
        onChange(values.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {/* Display existing values */}
            {values.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {values.map((value, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm"
                        >
                            {value}
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input field */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 input-field"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="btn-secondary flex items-center gap-1 px-4"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>
        </div>
    );
};

export default MultiInput;
