import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faComment, faTimes, faBell, faBars, faCog, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useChat } from "../context/Context";

const Header = () => {
    const { darkMode, toggleDarkMode } = useChat();
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
        setToggle(!toggle);
        
    };

    return (
        <div className={darkMode ? "dark" : ""}>


            <div className="flex justify-between fixed top-0 left-0 items-center w-full 
                            bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 
                            text-white font-extralight text-xs p-2 z-10 h-12 shadow-md">
                <h1 className="text-2xl font-serif">Chat App</h1>
                
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={toggleDarkMode} 
                        className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded-lg"
                    >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                    </button>

                    <button onClick={handleToggle} className="text-white text-xl">
                        {toggle ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
                    </button>
                </div>
            </div>

            <div 
                className={`fixed left-0 top-12 w-24 h-full z-20 
                            bg-[#6E00FF] dark:bg-gray-800 
                            text-white dark:text-gray-200 text-2xl font-extrabold 
                            rounded-lg p-4 border-gray-300 dark:border-gray-700 
                            transition-transform duration-300 ease-in-out ${toggle ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <ul>
                    <li className="border dark:border-gray-500 rounded-full w-16 h-16 flex items-center justify-center">
                        <div className="w-full h-full rounded-full overflow-hidden">
                            <img src="vite.svg" className="w-full h-full object-cover" alt="" />
                        </div>
                    </li>
                    <li className="p-5">
                        <Link to="/" className="flex items-center hover:text-gray-300 dark:hover:text-gray-400">
                            <FontAwesomeIcon icon={faHome} />
                        </Link>
                    </li>
                    <li className="p-5">
                        <Link to="/" className="flex items-center hover:text-gray-300 dark:hover:text-gray-400">
                            <FontAwesomeIcon icon={faComment} />
                        </Link>
                    </li>
                    <li className="p-5">
                        <Link to="/" className="flex items-center hover:text-gray-300 dark:hover:text-gray-400">
                            <FontAwesomeIcon icon={faBell} />
                        </Link>
                    </li>
                    <li className="p-5">
                        <Link to="/" className="flex items-center hover:text-gray-300 dark:hover:text-gray-400">
                            <FontAwesomeIcon icon={faCog} />
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
