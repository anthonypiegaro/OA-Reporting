export default function Hero() {
    return (
        <div className="flex flex-col justify-center w-full py-20 bg-gradient-to-t from-zinc-600 to-75% md:py-30 lg:py-40">
            <h1 className="px-3 mb-4 text-3xl font-bold text-center md:mb-4 md:text-5xl md:px-6 lg:mb-6 lg:text-6xl lg:px-16">
                Optimum Athletes
                <span className="pb-1 block bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-700 text-transparent bg-clip-text">
                    Reporting
                </span>
            </h1>
            <p className="self-center max-w-xl px-4 mb-4 font-medium text-center text-zinc-400 md:max-w-2xl md:text-lg lg:text-xl">
                Gain unparalleled insights into your performance. Our exclusive athlete reporting 
                service delivers detailed, easy-to-read stats to help you track progress and maximize 
                your training. Train smarter, perform better, and see results faster with our 
                cutting-edge analysis tailored for baseball athletes.
            </p>
        </div>
    )
}