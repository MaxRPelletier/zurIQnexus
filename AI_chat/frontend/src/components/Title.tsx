import { useState } from 'react';
import axios from 'axios';

type Props = {
    setMessages: any;
};

function Title({ setMessages }: Props) {
    const [isResetting, setIsResetting] = useState(false);

    // reset the conversation "http://127.0.0.1:8000/reset"
    const resetConversation = async () => {
        setIsResetting(true);

        await axios
            .get("https://ai-chat-bkn4.onrender.com/reset", {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                if (res.status == 200) {
                    setMessages([]);
                }
            })
            .catch((_err) => {});

        setIsResetting(false);
    };

    return (
        <div className='flex justify-between items-center w-full p-4 bg-gray-900 text-white font-bold shadow'>
            <div className='italic'>Let's Talk</div>
            {/*
            <a href="https://www.forvava.com/" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-square" viewBox="0 0 16 16">
                    <path d="M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0z"/>
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                </svg>
            </a>
            */}
            {/*
            <button
                onClick={resetConversation}
                className={
                    "{transition-all duration-300 text-blue-300 hover:text-pink-500 " +
                    (isResetting && "animate-pulse")
                }
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                </svg>
            </button>
            */}
        </div>
    );
}

export default Title;