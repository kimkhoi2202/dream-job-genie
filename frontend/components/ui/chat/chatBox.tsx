"use client";

import * as React from "react";
import { useCallback, useState, useRef } from "react";
import { ChatWindow } from "./ChatWindow";
import { MessageInput } from "./MessageInput";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Good morning! What can I do for you today?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatSources = (sources: string) => {
    const sourceList = sources.split(", ");
    const formattedSources = sourceList.map((source: string) => {
      const sourceName = source
        .replace("converted_texts/", "")
        .replace(".txt", "")
        .replace(/-/g, " ");
      return `- ${sourceName}`;
    });
    return formattedSources.join("\n");
  };

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim() !== "" && !isLoading) {
      setIsLoading(true);
      setInputText("");

      const userMessage = { sender: "user", text: inputText.trim() };

      setMessages([...messages, userMessage]);

      const userMessages = messages
        .filter((msg) => msg.sender === "user")
        .map((msg) => msg.text);
      userMessages.push(inputText.trim());

      const assistantMessages = messages
        .filter((msg) => msg.sender === "assistant")
        .map((msg) => msg.text);

      try {
        const response = await fetch("https://6c52-103-123-226-98.ngrok-free.app/chat", {
          method: "POST",
          body: JSON.stringify({
            prompt: assistantMessages + "\n\n" + userMessages,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        const formattedSources = formatSources(responseData.sources);

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "assistant",
            text: responseData.response.replace(/(?:\r\n|\r|\n)/g, "<br>") + "<br><br>Sources:<br>" + formattedSources.replace(/(?:\r\n|\r|\n)/g, "<br>"),
          },
        ]);
      } catch (error) {
        console.error("Error:", error);
      }

      setIsLoading(false);
    }
  }, [inputText, isLoading, messages]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage();
      event.preventDefault();
    }
  };

  const scrollAreaRef = useRef(null);

  return (
    <section>
      <ChatWindow messages={messages} scrollAreaRef={scrollAreaRef} />
      <MessageInput
        isLoading={isLoading}
        inputText={inputText}
        handleKeyDown={handleKeyDown}
        handleSendMessage={handleSendMessage}
        setInputText={setInputText}
      />
    </section>
  );
}


// import * as React from "react"
// // import * as dotenv from "dotenv";
// // import { OpenAIAPIKeyInput } from "./openaiAPIKeyInput"
// import { ChatWindow } from "./ChatWindow"
// import { MessageInput } from "./MessageInput"
// import { useCallback, useState, useRef, useEffect } from "react"
// //@ts-ignore
// import { fetchEventSource } from "@microsoft/fetch-event-source"

// // dotenv.config();

// export function ChatBox() {
//   const [oaiKey, setOaiKey] = useState("")
//   const [messages, setMessages] = useState([
//     { sender: "assistant", text: "Good morning! What can I do for you today?" },
//   ])
//   const [inputText, setInputText] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSendMessage = useCallback(async () => {
//     if (inputText.trim() !== "" && !isLoading) {
//       setIsLoading(true)
//       setInputText("")

//       const userMessage = { sender: "user", text: inputText.trim() }
//       const assistantMessage = { sender: "assistant", text: "" }

//       setMessages([...messages, userMessage, assistantMessage])

//       // Extract assistant and user messages
//       const userMessages = messages
//         .filter((msg) => msg.sender === "user")
//         .map((msg) => msg.text)
//       userMessages.push(inputText.trim()) // include the new user message
//       const assistantMessages = messages
//         .filter((msg) => msg.sender === "assistant")
//         .map((msg) => msg.text)

//       try {
//         let currentStreamedText = ""

//         await fetchEventSource("/api/chat", {
//           method: "POST",
//           body: JSON.stringify({
//             key: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//             chatModel: "gpt-3.5-turbo",
//             PROMPT: "You are an ai assistant.",
//             a: JSON.stringify(assistantMessages),
//             u: JSON.stringify(userMessages),
//           }),
//           headers: { "Content-Type": "application/json" },
//           onmessage(ev) {
//             if (ev.data) {
//               currentStreamedText += ev.data
//             } else {
//               currentStreamedText += "\n"
//             }

//             setMessages((prevMessages) => {
//               const newMessages = [...prevMessages]
//               const lastMessageIndex = newMessages.length - 1

//               newMessages[lastMessageIndex] = {
//                 ...newMessages[lastMessageIndex],
//                 text: currentStreamedText,
//               }

//               return newMessages
//             })
//           },
//           onerror(err) {
//             console.error("EventSource failed:", err)
//             setIsLoading(false)
//           },
//           onclose() {
//             setMessages((prevMessages) => {
//               const newMessages = [...prevMessages]
//               const lastMessageIndex = newMessages.length - 1

//               newMessages[lastMessageIndex] = {
//                 ...newMessages[lastMessageIndex],
//               }
//               setIsLoading(false)
//               return newMessages
//             })
//           },
//         })
//       } catch (error) {
//         console.error("Error:", error)
//         setIsLoading(false)
//       }
//     }
//   }, [inputText, isLoading, messages, oaiKey])

//   //@ts-ignore
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       handleSendMessage()
//       event.preventDefault()
//     }
//   }

//   // const isDisabled = !oaiKey
//   const scrollAreaRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (isLoading && scrollAreaRef.current) {
//       scrollAreaRef.current.scrollIntoView({ behavior: "smooth" })
//     }
//   }, [messages, isLoading])

//   return (
//     <section>
//       <ChatWindow messages={messages} scrollAreaRef={scrollAreaRef} />
//       <MessageInput
//         isLoading={isLoading}
//         inputText={inputText}
//         handleKeyDown={handleKeyDown}
//         handleSendMessage={handleSendMessage}
//         setInputText={setInputText}
//       />
//     </section>
//   );
// }
