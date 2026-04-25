import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import type { Conversation } from './components/Sidebar';
import type { Message } from './components/MessageItem';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c-1',
    name: 'Alice Nguyen',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    lastMessage: 'Can you review my PR for the dashboard?',
    time: '11:01 AM',
    unread: 2,
    isGroup: false,
    status: 'online',
  },
  {
    id: 'c-2',
    name: 'Engineering Team',
    avatar: '',
    lastMessage: 'Alice: Should we add Storybook?',
    time: '10:15 AM',
    unread: 3,
    isGroup: true,
  },
  {
    id: 'c-3',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    lastMessage: 'The backdrop-blur looks amazing 🎨',
    time: '10:06 AM',
    unread: 0,
    isGroup: false,
    status: 'online',
  },
  {
    id: 'c-4',
    name: 'Design Review',
    avatar: '',
    lastMessage: 'Charlie: Let\'s finalize the tokens',
    time: 'Yesterday',
    unread: 0,
    isGroup: true,
  },
  {
    id: 'c-5',
    name: 'Charlie Lee',
    avatar: 'https://i.pravatar.cc/150?u=charlie',
    lastMessage: 'Great work everyone!',
    time: 'Yesterday',
    unread: 0,
    isGroup: false,
    status: 'away',
  },
  {
    id: 'c-6',
    name: 'Diana Park',
    avatar: 'https://i.pravatar.cc/150?u=diana',
    lastMessage: 'See you at the standup',
    time: 'Mon',
    unread: 0,
    isGroup: false,
    status: 'offline',
  },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'c-1': [
    { id: '101', sender: 'Alice Nguyen', avatar: 'https://i.pravatar.cc/150?u=alice', time: '11:00 AM', content: 'Hey! Can you review my PR for the dashboard layout? I\'ve pushed the changes.' },
    { id: '102', sender: 'Alice Nguyen', avatar: 'https://i.pravatar.cc/150?u=alice', time: '11:01 AM', content: 'Can you review my PR for the dashboard?' },
  ],
  'c-2': [
    { id: '201', sender: 'Alice Nguyen', avatar: 'https://i.pravatar.cc/150?u=alice', time: '10:00 AM', content: 'Hey team! How is the new design system integration coming along?' },
    { id: '202', sender: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=bob', time: '10:05 AM', content: 'Almost done! Just tweaking the glassmorphism effects on the authentication cards. The backdrop-blur looks amazing 🎨' },
    { id: '203', sender: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=bob', time: '10:06 AM', content: 'Also added animated gradients to the backgrounds — really gives it that premium feel.' },
    { id: '204', sender: 'Charlie Lee', avatar: 'https://i.pravatar.cc/150?u=charlie', time: '10:10 AM', content: 'Looks amazing so far. Great work everyone! Let\'s make sure we follow our coding standards for the PR review.' },
    { id: '205', sender: 'Alice Nguyen', avatar: 'https://i.pravatar.cc/150?u=alice', time: '10:15 AM', content: 'Agreed! I\'ll set up the CI pipeline for automated testing this afternoon. Should we also add Storybook for component documentation?' },
  ],
  'c-3': [
    { id: '301', sender: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=bob', time: '10:05 AM', content: 'Just tweaking the glassmorphism effects on the authentication cards.' },
    { id: '302', sender: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=bob', time: '10:06 AM', content: 'The backdrop-blur looks amazing 🎨' },
  ],
  'c-4': [],
  'c-5': [
    { id: '501', sender: 'Charlie Lee', avatar: 'https://i.pravatar.cc/150?u=charlie', time: 'Yesterday', content: 'Great work everyone!' },
  ],
  'c-6': [],
};

const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState('c-2');
  const [messagesData, setMessagesData] = useState(INITIAL_MESSAGES);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeConv = conversations.find(c => c.id === activeId);
  const activeMessages = messagesData[activeId] || [];

  const handleConversationSelect = useCallback((id: string) => {
    setActiveId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setSidebarOpen(false);
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?u=current',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
    };

    setMessagesData(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage],
    }));

    // Update last message in conversation list
    setConversations(prev => prev.map(c =>
      c.id === activeId ? { ...c, lastMessage: `You: ${content}`, time: newMessage.time } : c
    ));
  }, [activeId]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <Navbar onToggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeId}
          onConversationSelect={handleConversationSelect}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ChatArea
          conversationName={activeConv?.name || ''}
          conversationAvatar={activeConv?.avatar}
          isGroup={activeConv?.isGroup}
          status={activeConv?.status}
          messages={activeMessages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
