import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

interface QualFormProps {
    handleSuccess: (name: string) => void;
}

export default function QualForm({ handleSuccess }: QualFormProps) {
    const form = useForm();

    return (
        <Form {...form}>
            <form className="space-y-4">
                
            </form>
        </Form>
    )
}