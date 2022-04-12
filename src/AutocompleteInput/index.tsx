import React, { FC, useRef, useState, useEffect } from 'react';
import { Input, ScrollbarComponent } from '@kubevious/ui-components';
import styles from './styles.module.css';

export interface AutocompleteInputProps
{ 
    value: any;
    items: any[];

    placeholder?: string;

    isDisabled?: boolean;

    handleInput: (value: string) => void;
}

export const AutocompleteInput: FC<AutocompleteInputProps> = ({ 
    value,
    items,
    isDisabled,
    placeholder,
    handleInput
}) => {

    const targetRef = useRef(null);

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [hideTimer, setHideTimer] = useState<any>(null);

    const onFocus = () => {
        console.log("onFocus ");
        setIsFocused(true);
        setIsVisible(true);
        if (hideTimer) {
            clearTimeout(hideTimer);
        }
        setHideTimer(null);
    }
    const onBlur = () => {
        console.log("onBlur ");
        setIsFocused(false);
    }
    const onChange = (newValue: string) => {
        console.log("onChange ", newValue);
        handleInput(newValue);
    }

    const activateItem = (newValue: string) => {
        console.log("activateItem: ", newValue);
        setIsFocused(false);
        handleInput(newValue);
    }

    useEffect(() => {
        if (hideTimer) {
            clearTimeout(hideTimer);
            setHideTimer(null);
        }
        if (!isFocused) {
            const timer = setTimeout(() => {
                setIsVisible(false);
    
            }, 100);
            setHideTimer(timer);
        }
    }, [isFocused])
    
    return (
        <div className={styles.container}
            onFocus={onFocus}
            onBlur={onBlur}
        >

            <div className={styles.inputWrapper}
                  ref={targetRef}>
                <Input  placeholder={placeholder}
                        disabled={isDisabled}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        />
            </div>

            {(isVisible && (items && items.length > 0)) && 
                <div className={styles.autocompleteContainer}
                     >

                    <ScrollbarComponent>
                        <div 
                            className={styles.itemList}
                            >
                            {items && items.map((item, index) => 
                                <button key={index}
                                        className={styles.autocompleteItem}
                                        onClick={() => activateItem(item)}
                                        >
                                    {item}
                                </button>
                            )}
                        </div>
                    </ScrollbarComponent>

                </div>
            }
        </div>
    );
};
