import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/HomePage.css"; // Import styles

// Connect to WebSocket server
const socket = io("http://localhost:5001");

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State Variables
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");

  // Get User Email from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userEmail = params.get("email");

    if (userEmail) {
      setSenderEmail(userEmail);
      socket.emit("registerUser", userEmail); // Register user in WebSocket
    }

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [location]);

  // Fetch Contacts from Server
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/contacts");
        const data = await response.json();
  
        // ✅ Filter contacts to exclude the logged-in user
        const filteredContacts = data.filter(contact => contact.email !== senderEmail);
        setContacts(filteredContacts);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };
  
    if (senderEmail) fetchContacts(); // ✅ Fetch only when senderEmail is set
  }, [senderEmail]); // ✅ Run this when senderEmail updates
  

  // Fetch Messages when a Contact is Selected
  useEffect(() => {
    if (!senderEmail || !receiverEmail) return;

    // console.log(`Fetching messages for: ${senderEmail} -> ${receiverEmail}`);

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/recieveMessages/${senderEmail}/${receiverEmail}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [senderEmail, receiverEmail]); // ✅ Added receiverEmail as a dependency

  // Listen for Incoming Messages in Real-Time
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send Message using WebSockets
  const sendMessage = () => {
    if (input.trim() !== "" && receiverEmail && receiverEmail !== senderEmail) {
      // console.log(`Sending Message From: ${senderEmail} To: ${receiverEmail}`);

      const messageData = {
        sender: senderEmail,
        recipient: receiverEmail,
        text: input,
      };

      socket.emit("sendMessage", messageData); // Send message in real-time
      setMessages((prev) => [...prev, messageData]); // Optimistic UI update
      setInput("");
    }
  };

  // Logout Function
  const handleLogout = () => {
    navigate("/SignUp"); // Redirect to sign-up page
  };

  return (
    <div className="chat-container">
      {/* Sidebar with Contacts */}
      <div className="contacts-list">
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h2>Contacts</h2>
        <div className="contacts-scrollable">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className={`contact ${
                selectedContact === contact.username ? "active" : ""
              }`}
              onClick={() => {
                console.log("Selected Contact:", contact.username, "Email:", contact.email); // Debug log
                if (contact.email !== senderEmail) {
                  setSelectedContact(contact.username);
                  setReceiverEmail(contact.email);
                }
              }}
            >
              <strong>{contact.username}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <header className="chat-header">
          {selectedContact ? `Chat with ${selectedContact}` : "Select a Contact"}
        </header>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === senderEmail ? "sent" : "received"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {selectedContact && (
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="send-button">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
