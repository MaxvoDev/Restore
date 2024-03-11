import { FormGroup, FormControlLabel, Checkbox, FormLabel } from "@mui/material";
import { useState } from "react";

interface Props {
    label: string;
    name: string;
    items: string[];
    checked?: string[];
    onChange: (params: any) => void;
}

export default function CheckboxButtonGroup({ label, name, items, checked, onChange }: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || []);

    function handleChecked(value: string) {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];
        if (currentIndex === -1) newChecked = [...checkedItems, value];
        else newChecked = checkedItems.filter(i => i !== value);
        setCheckedItems(newChecked);
        onChange({
            name, 
            value: newChecked
        });
    }

    return (
        <FormGroup>
            <FormLabel component="legend" sx={{ marginTop: 3 }}>{label}</FormLabel>
            {items.map(item => (
                <FormControlLabel
                    key={item}
                    control={<Checkbox
                        checked={checkedItems.indexOf(item) !== -1}
                        onClick={() => handleChecked(item)}
                    />}
                    label={item} />
            ))}
        </FormGroup>
    )
}