interface BaseLogoProps {
    content: string;
    icon: JSX.Element;
}

export default function BaseLogo({ content, icon }: BaseLogoProps) {
    return (
        <div className="flex flex-row items-end w-auto">
            {icon}
            <p className="text-xl font-semibold">{content}</p>
        </div>
    )
}