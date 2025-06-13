import { useState, useEffect, useRef } from 'react';
import { Send, User, UserRoundX, ArrowLeft } from 'lucide-react';
import ChatController from '../../controllers/ChatController.js';
import Message from '../../models/MessageModel.js';

const ChatRoom = ({ friend, onBack, ws }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch messages when component mounts
  useEffect(() => {
    if (friend) {
      fetchMessages(friend.phone);
    }

    // Handle incoming messages
    const handleMessage = (data) => {
      console.log('Message received:', data);
      if (friend && (data.sender === friend.phone || data.receiver === friend.phone)) {
        const myPhone = localStorage.getItem('user_phone');
        const isMyMessage = data.sender === myPhone;

        if (!isMyMessage || !data.isLocalMessage) {
          const newMessage = Message.fromJson(data);
          setMessages((prev) => [...prev, newMessage]);
        }
      }
    };

    // Handle typing indicators
    const handleTyping = (data) => {
      console.log('Typing indicator received:', data);
      if (friend && data.sender === friend.phone) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      console.log('Stop typing indicator received:', data);
      if (friend && data.sender === friend.phone) {
        setIsTyping(false);
      }
    };

    // Add event listeners
    if (ws.current) {
      ws.current.on('message', handleMessage);
      ws.current.on('typing', handleTyping);
      ws.current.on('stop-typing', handleStopTyping);

      // Emit a join-room event to ensure proper room connection
      ChatController.joinChatRoom(ws.current, friend.phone);
    }

    return () => {
      // Clean up event listeners when component unmounts
      if (ws.current) {
        ws.current.off('message', handleMessage);
        ws.current.off('typing', handleTyping);
        ws.current.off('stop-typing', handleStopTyping);
      }
    };
  }, [friend, ws]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (friendPhone) => {
    try {
      setLoadingMessages(true);
      const response = await ChatController.getMessages(friendPhone);
      if (response.success) {
        setMessages(response.messages || []);
      } else {
        console.error('Failed to load messages:', response.message);
      }
    } catch (err) {
      console.error('Messages fetch error:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !friend) return;

    const messageData = {
      receiver: friend.phone,
      message: newMessage,
    };

    ChatController.sendMessage(ws.current, messageData, (result) => {
      if (result.success) {
        setMessages((prev) => [...prev, result.message]);
      } else {
        console.error('Failed to send message:', result.message);
      }
    });

    // Clear input field
    setNewMessage('');
  };

  const handleTypingIndicator = () => {
    if (!friend) return;

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Send typing event
    ChatController.sendTypingIndicator(ws.current, friend.phone);

    // Set timeout to stop typing after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      ChatController.sendStopTypingIndicator(ws.current, friend.phone);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleDeleteFriend = async () => {
    if (!friend) return;

    if (window.confirm(`Are you sure want to delete ${friend.name} from your friend list?`)) {
      try {
        const response = await ChatController.deleteFriend(friend.phone);
        if (response.success) {
          alert(response.message);
          // Redirect ke halaman utama atau refresh daftar teman
          window.location.reload();
        } else {
          alert(`Error delete friend: ${response.message}`);
        }
      } catch (err) {
        console.error('Delete friend error:', err);
        alert('Terjadi kesalahan saat menghapus teman');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-100 p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onBack} className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Back">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">{friend.name}</h3>
              <p className="text-xs text-gray-500">{friend.phone}</p>
            </div>
          </div>
          <button onClick={handleDeleteFriend} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Hapus teman">
            <UserRoundX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-3 sm:p-4 bg-gray-50">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <User className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-gray-300" />
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Tampilkan tanggal di awal percakapan */}
            {messages.length > 0 && (
              <div className="flex justify-center my-2">
                <div className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">{messages[0].formatDate()}</div>
              </div>
            )}

            {messages.map((msg, index) => {
              const isSentByMe = msg.isSentByMe();
              return (
                <div key={index} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] sm:max-w-[70%] px-3 sm:px-4 py-2 rounded-lg ${isSentByMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="break-words text-sm sm:text-base">{msg.message}</p>
                  </div>
                  <div className={`flex flex-col items-end ${isSentByMe ? 'ml-2' : 'mr-2'}`}>
                    <p className={`text-[10px] sm:text-xs ${isSentByMe ? 'text-gray-500' : 'text-gray-500'}`}>{msg.formatTime()}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white p-2 sm:p-3 border-t border-gray-200">
        {isTyping && (
          <div className="text-xs text-gray-500 mb-1 ml-2 flex items-center">
            <div className="mr-2">{friend.name} sedang mengetik</div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTypingIndicator();
            }}
            placeholder="Type a message..."
            className="flex-grow px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="h-[40px] sm:h-[46px] px-3 sm:px-4 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md transform hover:scale-105 active:scale-95 duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
