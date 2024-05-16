import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BiSend } from "react-icons/bi";
import { AuthContext } from "../contexts/AuthContext/AuthProvider";
import { SiChatbot } from "react-icons/si";
import { IoMdClose } from "react-icons/io";

const AiAssistant = () => {
  const { isOpenChatModal, toggleModal, userDB } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "AI",
      message:
        "Welcome to our AI-powered library recommendation system! Share your thoughts, interests, or the type of books you enjoy, and our AI will suggest relevant books and related topics. Simply type your preferences or questions below to get started",
    },
  ]);
  const [preAssignedQuestions, setPreAssignedQuestions] = useState([
    "Can you suggest some biographies of famous authors or historical figures?",
    "What are some recent releases in the field of literary criticism or book analysis?",
    "Are there any poetry anthologies featuring contemporary poets?",
    "Can you recommend books on bookbinding, typography, or other aspects of book design?",
    "What are some popular titles in the genre of bibliomemoirs or books about books?",
    "Are there any books on the history of libraries or the culture of reading?",
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Function to handle when a pre-assigned question is clicked
  const handlePreAssignedQuestionClick = (question) => {
    // setChatHistory((prevChatHistory) => [
    //   ...prevChatHistory,
    //   { sender: "You", message: question },
    // ]);
    sendMessage(question);
    setUserInteracted(true);
  };

  /**
   * Send a message to the chat.
   */
  const sendMessage = async (question) => {
    console.log({ question });
    if (!inputValue && !question) return true;

    try {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: "You", message: inputValue || question },
      ]);

      setIsTyping(true);
      const response = await axios.post("/users/chat", {
        message: inputValue || question,
        chatHistory: chatHistory,
      });
      const responseData = response.data.data;
      setIsTyping(false);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: "AI", message: responseData },
      ]);
      setInputValue("");
      setUserInteracted(true); // User has interacted with the chat
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (chatHistory.length > 1) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div>
      <div
        className={`fixed bottom-[calc(20px)] md:bottom-[calc(2rem+1.5rem)] lg:bottom-10 2xl:bottom-10 left-[4%] md:left-[35%] lg:left-[30%]
           mr-4 bg-white rounded-lg border border-[#e5e7eb] w-[90%] md:w-[60%] lg:w-[550px] h-[634px] transition-opacity overflow-y-auto shadow-lg ${
             isOpenChatModal ? "opacity-100" : "opacity-0 pointer-events-none"
           }`}
        ref={messageContainerRef}
      >
        <Heading toggleModal={toggleModal} />

        <div
          className="px-4 min-h-[274px] mb-14"
          style={{ minWidth: "100%", display: "table" }}
        >
          {chatHistory.map((chat, index) => (
            <ChatMessage
              sender={chat?.sender}
              message={chat?.message}
              key={index}
              chatRef={null}
              user={userDB}
            />
          ))}
          {isTyping && (
            <div className="flex items-start gap-3 mt-5 text-gray-600 text-sm flex-1">
              <div className="flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-8 h-8 bg-blue-600 hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900">
                <SiChatbot className="w-4 h-4 text-white" />
              </div>

              <div className="max-w-[450px] ">
                <p className="leading-relaxed">
                  <span className="block font-bold text-gray-700">AI</span>
                </p>
                <p className="bg-gray-100 px-2 py-1 rounded-md rounded-tl-none pt-0.5">
                  Typing...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={`${userInteracted && "mt-48"}  px-4`}>
          {!userInteracted && (
            <>
              {preAssignedQuestions.map((question, index) => (
                <div
                  key={index}
                  onClick={() => handlePreAssignedQuestionClick(question)}
                  className="cursor-pointer border border-gray-300 text-xs py-1 px-3 rounded-lg mb-2"
                >
                  {question}
                </div>
              ))}
            </>
          )}

          <div className="sticky  bottom-6 mb-4">
            <input
              disabled={isTyping}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-[1px] w-full pl-4 border-gray-200 rounded-[25px] text-gray-700 placeholder:text-gray-500 text-[14px] h-[54px] mt-3 pr-10 bg-gray-50"
              placeholder="Type here"
            />
            <BiSend
              disabled={isTyping}
              onClick={sendMessage}
              className="absolute top-[38px] transform -translate-y-1/2 right-4 h-9 w-9 bg-blue-600 text-white rounded-full p-1.5 cursor-pointer"
              alt="Sparkle Icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;

const Heading = ({ toggleModal }) => (
  <div className="sticky top-0 bg-white flex flex-col space-y-1.5 ">
    <div className="flex justify-between items-center shadow-md px-4 py-3">
      <div className="flex gap-2 items-center">
        <div className="inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-14 h-14 bg-blue-600 hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900">
          <SiChatbot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-lg tracking-tight">AI Assistant</h2>
          <p className="text-xs text-[#6b7280] leading-3">AI Helper</p>
        </div>
      </div>
      <IoMdClose onClick={toggleModal} className="w-6 h-6 cursor-pointer" />
    </div>
  </div>
);

const ChatMessage = ({ sender, message, chatRef, user }) => (
  <div
    className="flex items-start gap-3 mt-5 text-gray-600 text-sm flex-1"
    ref={chatRef}
  >
    {sender === "AI" ? (
      <div className="flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-8 h-8 bg-blue-600 hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900">
        <SiChatbot className="w-4 h-4 text-white" />
      </div>
    ) : (
      <img src={user?.image} className="w-8 h-8 rounded-full" alt="user" />
    )}
    <div className="max-w-[450px] ">
      <p className="leading-relaxed">
        <span className="block font-bold text-gray-700">{sender}</span>
      </p>
      <p className="bg-gray-100 px-2 py-1 rounded-md rounded-tl-none pt-0.5">
        <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
      </p>
    </div>
  </div>
);
