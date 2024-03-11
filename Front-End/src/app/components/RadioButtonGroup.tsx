import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface Props{
    label: string;
    name: string;
    options: any[];
    selectedValue: string;
    onChange: (params: any) => void;
}

export default function RadioButtonGroup({ label, name, options, selectedValue, onChange }: Props) {
    return (
        <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ marginBottom: 1 }}>{label}</FormLabel>
            <RadioGroup name={name} value={selectedValue} 
            onChange={(e) => onChange({
                name,
                value: e.target.value
            })}>
                {options.map(({ value, label }) => (
                    <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}