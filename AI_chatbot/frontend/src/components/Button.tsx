

type Props = {
    runFunction: any;
};

function Button({ runFunction }: Props) {
    return (
        <button onClick={runFunction} className="transition-all duration-300 border border-gray-200 w-full mt-4 py-12 rounded-xl bg-orange-500 hover:bg-red-600 text-white">
            Button
        </button>
    )
}


export default Button