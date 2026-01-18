import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type AvailabilityFilterProps = {
    value: string;
    onChange: (value: string) => void;
};

export const AvailabilityFilter = ({ value, onChange }: AvailabilityFilterProps) => {
    const options = [
        { value: "", label: "All" },
        { value: "in_stock", label: "In stock" },
        { value: "out_of_stock", label: "Out of stock" },
    ];

    const currentLabel = options.find(opt => opt.value === value)?.label || "Availability";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    {currentLabel}
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={value === option.value}
                        onCheckedChange={() => onChange(option.value)}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
