import { useChat } from "../context/Context"
import Chat from "./Chat";
import Member from "./Member";


const Main = () => {
    const {receiverId, setReceiverId} = useChat();
  return (
    <div className='flex w-full gap-7'>
            <div>
                <Member setReceiverId={setReceiverId} />
            </div>
            <div className='flex w-full'>
                {receiverId ? <Chat receiverId={receiverId} /> : <div>Select a user to start chatting</div>}
            </div>
        </div>
  )
}

export default Main
