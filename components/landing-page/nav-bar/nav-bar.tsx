import EnterAppButton from "./enter-app-button"

export default function NavBar() {
    return (
        <nav className="w-full py-5 flex flex-row justify-end px-4">
            <EnterAppButton />
        </nav>
    )
}