import { toast } from "react-toastify";
import { Slide } from "react-toastify";


const toastConfig = {
    position: "bottom-left",  
    autoClose: 1000,          
    hideProgressBar: true,     
    closeOnClick: true,        
    pauseOnHover: false,       
    draggable: true,           
    theme: "dark",             
    transition: Slide,        
    style: {                    
        background: "linear-gradient(to right, #1E3A8A, #9333EA)",  
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        borderRadius: "10px",
        padding: "12px 20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    },
};


export const showToastSuccess = (message: string) => {
    toast.success(message, toastConfig);
};

export const showToastError = (message: string) => {
    toast.error(message, toastConfig);
};
