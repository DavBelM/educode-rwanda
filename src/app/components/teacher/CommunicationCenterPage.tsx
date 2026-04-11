import React, { useState } from 'react';
import { Send, Search, Filter, MessageSquare, Bell, Archive, Trash2, Clock, CheckCircle2, AlertCircle, Users, User, Plus } from 'lucide-react';

interface CommunicationCenterPageProps {
  language: 'EN' | 'KIN';
}

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  status: 'new' | 'replied' | 'resolved';
  type: 'question' | 'help' | 'feedback';
  read: boolean;
}

export function CommunicationCenterPage({ language }: CommunicationCenterPageProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'announcements'>('inbox');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'replied' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const isKinyarwanda = language === 'KIN';

  const messages: Message[] = [
    {
      id: '1',
      from: 'Jean Mugisha',
      subject: isKinyarwanda ? 'Ikibazo kuri Loops' : 'Question about Loops',
      preview: isKinyarwanda ? 'Ndashaka ubufasha kuri for loops. Ntabwo nsobanukirwa...' : 'I need help with for loops. I don\'t understand...',
      timestamp: isKinyarwanda ? 'Amasaha 2 ashize' : '2 hours ago',
      status: 'new',
      type: 'question',
      read: false
    },
    {
      id: '2',
      from: 'Marie Uwase',
      subject: isKinyarwanda ? 'Ikibazo ku mushinga' : 'Assignment clarification',
      preview: isKinyarwanda ? 'Ese umushinga w\'inyuma ugomba gukorwa ute?' : 'How should the final project be structured?',
      timestamp: isKinyarwanda ? 'Ejo' : 'Yesterday',
      status: 'replied',
      type: 'question',
      read: true
    },
    {
      id: '3',
      from: 'David Nkunda',
      subject: isKinyarwanda ? 'Gusaba ubufasha' : 'Help request',
      preview: isKinyarwanda ? 'Ndakeneye ubufasha kuri Arrays assignment' : 'I need help with the Arrays assignment',
      timestamp: isKinyarwanda ? 'Iminsi 2 ishize' : '2 days ago',
      status: 'resolved',
      type: 'help',
      read: true
    },
    {
      id: '4',
      from: 'Grace Mutesi',
      subject: isKinyarwanda ? 'Igitekerezo' : 'Feedback',
      preview: isKinyarwanda ? 'Ndashimira isomo rya nyuma! Ryari ryiza cyane' : 'Thank you for the last lesson! It was very helpful',
      timestamp: isKinyarwanda ? 'Iminsi 3 ishize' : '3 days ago',
      status: 'new',
      type: 'feedback',
      read: false
    },
    {
      id: '5',
      from: 'Patrick Habimana',
      subject: isKinyarwanda ? 'Ikibazo cy\'itariki' : 'Due date question',
      preview: isKinyarwanda ? 'Ese tushobora kongera itariki y\'umushinga?' : 'Can we get an extension on the assignment?',
      timestamp: isKinyarwanda ? 'Iminsi 4 ishize' : '4 days ago',
      status: 'replied',
      type: 'question',
      read: true
    }
  ];

  const announcements = [
    {
      id: '1',
      title: isKinyarwanda ? 'Isomo rishya rya JavaScript' : 'New JavaScript lesson',
      date: isKinyarwanda ? 'Ukwakira 5, 2026' : 'April 5, 2026',
      recipients: isKinyarwanda ? 'Ishuri ryose' : 'Entire class',
      sent: true
    },
    {
      id: '2',
      title: isKinyarwanda ? 'Itariki y\'ikizamini yaje guhinduka' : 'Exam date changed',
      date: isKinyarwanda ? 'Werurwe 28, 2026' : 'March 28, 2026',
      recipients: isKinyarwanda ? 'Ishuri ryose' : 'Entire class',
      sent: true
    }
  ];

  const quickReplies = [
    isKinyarwanda ? 'Murakoze ku kibazo. Nzagusubiza vuba.' : 'Thanks for your question. I\'ll reply soon.',
    isKinyarwanda ? 'Reba isomo rya video kuri ubu buce.' : 'Please review the video lesson on this topic.',
    isKinyarwanda ? 'Tuza kwiganiraho mu gitondo.' : 'We\'ll discuss this in class tomorrow.',
    isKinyarwanda ? 'Reba amakosa yawe mu code.' : 'Please check your code for errors.'
  ];

  const filteredMessages = messages.filter(m => {
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchesSearch = m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter(m => !m.read).length;
  const newCount = messages.filter(m => m.status === 'new').length;

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4 text-[#0ea5e9]" />;
      case 'replied': return <MessageSquare className="w-4 h-4 text-[#f59e0b]" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />;
    }
  };

  const getStatusLabel = (status: Message['status']) => {
    if (isKinyarwanda) {
      switch (status) {
        case 'new': return 'Nshya';
        case 'replied': return 'Byasubijwe';
        case 'resolved': return 'Byakemuwe';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-[#0ea5e9]';
      case 'help': return 'bg-red-100 text-[#ef4444]';
      case 'feedback': return 'bg-green-100 text-[#22c55e]';
    }
  };

  const toggleMessageSelection = (id: string) => {
    setSelectedMessages(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] mb-2">
              {isKinyarwanda ? 'Ikigo cy\'itumanaho' : 'Communication Center'}
            </h1>
            <p className="text-gray-600">
              {isKinyarwanda ? 'Ohereza ubutumwa n\'ibisubizo by\'abanyeshuri' : 'Send announcements and respond to student messages'}
            </p>
          </div>
          <button
            onClick={() => setShowComposeModal(true)}
            className="px-6 py-3 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            {isKinyarwanda ? 'Itangazo Rishya' : 'New Announcement'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`pb-3 px-4 font-semibold transition-all relative ${
              activeTab === 'inbox'
                ? 'text-[#10b981] border-b-2 border-[#10b981]'
                : 'text-gray-600 hover:text-[#10b981]'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {isKinyarwanda ? 'Ububiko' : 'Inbox'}
              {unreadCount > 0 && (
                <span className="bg-[#ef4444] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`pb-3 px-4 font-semibold transition-all relative ${
              activeTab === 'announcements'
                ? 'text-[#10b981] border-b-2 border-[#10b981]'
                : 'text-gray-600 hover:text-[#10b981]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {isKinyarwanda ? 'Amatangazo' : 'Announcements'}
            </div>
          </button>
        </div>

        {activeTab === 'inbox' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Message List */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={isKinyarwanda ? 'Shakisha ubutumwa...' : 'Search messages...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: isKinyarwanda ? 'Byose' : 'All' },
                      { id: 'new', label: isKinyarwanda ? 'Nshya' : 'New', count: newCount },
                      { id: 'replied', label: isKinyarwanda ? 'Byasubijwe' : 'Replied' },
                      { id: 'resolved', label: isKinyarwanda ? 'Byakemuwe' : 'Resolved' }
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setFilterStatus(filter.id as any)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          filterStatus === filter.id
                            ? 'bg-[#10b981] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label}
                        {filter.count !== undefined && filter.count > 0 && (
                          <span className="ml-1">({filter.count})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedMessages.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0ea5e9]">
                    {selectedMessages.length} {isKinyarwanda ? 'byatoranyijwe' : 'selected'}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm">
                      <Archive className="w-4 h-4" />
                      {isKinyarwanda ? 'Kubika' : 'Archive'}
                    </button>
                    <button className="px-3 py-2 bg-white text-[#ef4444] border border-red-300 rounded-lg font-semibold hover:bg-red-50 transition-all flex items-center gap-2 text-sm">
                      <Trash2 className="w-4 h-4" />
                      {isKinyarwanda ? 'Gusiba' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}

              {/* Messages List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${
                      !message.read ? 'bg-blue-50' : ''
                    } ${selectedMessage?.id === message.id ? 'border-l-4 border-l-[#10b981]' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleMessageSelection(message.id);
                        }}
                        className="w-4 h-4 mt-1 text-[#10b981] rounded focus:ring-2 focus:ring-[#10b981]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className={`font-semibold ${!message.read ? 'text-[#1e293b]' : 'text-gray-700'}`}>
                              {message.from}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(message.type)}`}>
                              {message.type}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <div className={`font-medium mb-1 ${!message.read ? 'text-[#1e293b]' : 'text-gray-700'}`}>
                          {message.subject}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {message.preview}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(message.status)}
                          <span className="text-xs text-gray-600">{getStatusLabel(message.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Message Detail / Quick Replies */}
            <div className="space-y-6">
              {selectedMessage ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#1e293b]">{selectedMessage.subject}</h3>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold text-gray-700">{selectedMessage.from}</span>
                      <span className="text-xs text-gray-500">• {selectedMessage.timestamp}</span>
                    </div>
                    <p className="text-gray-700">{selectedMessage.preview}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isKinyarwanda ? 'Subiza' : 'Reply'}
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981] mb-3"
                      rows={4}
                      placeholder={isKinyarwanda ? 'Andika igisubizo cyawe...' : 'Type your reply...'}
                    />
                    <button className="w-full px-4 py-2 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      {isKinyarwanda ? 'Ohereza' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-[#1e293b] mb-4">
                    {isKinyarwanda ? 'Hitamo ubutumwa' : 'Select a message'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isKinyarwanda ? 'Kanda ku butumwa kugirango ubone no gusubiza' : 'Click on a message to view and reply'}
                  </p>
                </div>
              )}

              {/* Quick Replies */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#1e293b] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#10b981]" />
                  {isKinyarwanda ? 'Ibisubizo byihuse' : 'Quick Replies'}
                </h3>
                <div className="space-y-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Announcements Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sent Announcements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">
                {isKinyarwanda ? 'Amatangazo yoherejwe' : 'Sent Announcements'}
              </h2>

              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                      <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {announcement.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {announcement.recipients}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compose Announcement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#1e293b] mb-6">
                {isKinyarwanda ? 'Kora itangazo rishya' : 'Create New Announcement'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isKinyarwanda ? 'Umutwe' : 'Title'}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                    placeholder={isKinyarwanda ? 'Andika umutwe...' : 'Enter title...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isKinyarwanda ? 'Ubutumwa' : 'Message'}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                    rows={6}
                    placeholder={isKinyarwanda ? 'Andika ubutumwa bwawe...' : 'Type your message...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isKinyarwanda ? 'Abakiriye' : 'Recipients'}
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]">
                    <option>{isKinyarwanda ? 'Ishuri ryose' : 'Entire class'}</option>
                    <option>{isKinyarwanda ? 'Hitamo abanyeshuri' : 'Select students'}</option>
                  </select>
                </div>

                <button className="w-full px-6 py-3 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  {isKinyarwanda ? 'Ohereza itangazo' : 'Send Announcement'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
