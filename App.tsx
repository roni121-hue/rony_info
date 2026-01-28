
import React, { useState, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Linkedin, 
  Instagram, 
  Github, 
  Facebook,
  Twitter,
  Download, 
  Edit3, 
  ArrowLeft,
  Sparkles,
  Camera,
  Check,
  User,
  Share2,
  QrCode,
  Loader2,
  X,
  Sun,
  Moon,
  Copy,
  ClipboardCheck,
  Send,
  ExternalLink,
  Info,
  ArrowDownCircle,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toJpeg } from 'html-to-image';
import { UserProfile, AppScreen } from './types';
import { IconWrapper } from './components/IconWrapper';
import { generateEnhancedBio } from './services/geminiService';

const INITIAL_PROFILE: UserProfile = {
  name: "RONI MIA LITON",
  role: "Technical Support Specialist",
  company: "Freelance Engineer",
  bio: "Technical professional providing high-end electrical and electronics solutions with advanced logic development and system integration.",
  email: "ronyinfo77@gmail.com",
  phone: "+880 1914153333",
  whatsapp: "01914153333",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  github: "https://github.com",
  facebook: "https://facebook.com/fb.account.rony",
  twitter: "https://twitter.com/Rony_3333",
  // Using the direct link to ensure the image displays correctly in the browser
  avatarUrl: "https://i.ibb.co.com/tTtDGKBs/rt3r.jpg", 
  theme: 'dark'
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [screen, setScreen] = useState<AppScreen>(AppScreen.VIEW);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [aiKeywords, setAiKeywords] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = profile.theme === 'dark';

  const handleSaveToContacts = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.company}
TITLE:${profile.role}
TEL;TYPE=CELL:${profile.phone}
EMAIL:${profile.email}
END:VCARD`;
    
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyContactInfo = async () => {
    const info = `Name: ${profile.name}
Role: ${profile.role} at ${profile.company}
Phone: ${profile.phone}
Email: ${profile.email}
WhatsApp: https://wa.me/${profile.whatsapp}
LinkedIn: ${profile.linkedin}`;

    try {
      await navigator.clipboard.writeText(info);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShareCard = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    
    try {
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        cacheBust: true,
        filter: (node: HTMLElement) => {
          const exclusionClasses = ['header-actions', 'action-buttons-container', 'theme-toggle-container'];
          return !exclusionClasses.some(cls => node.classList?.contains(cls));
        }
      });

      setShareImageUrl(dataUrl);
      const fileName = `${profile.name.replace(/\s+/g, '_')}_BusinessCard.jpg`;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${profile.name}'s Digital Business Card`,
            text: `Hi! Here is my digital business card. Let's connect!`,
          });
          setIsSharing(false);
          return;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            setIsSharing(false);
            return;
          }
        }
      }

      setShowShareModal(true);
    } catch (err) {
      console.error('Error generating card image:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadCard = () => {
    if (shareImageUrl) {
      const fileName = `${profile.name.replace(/\s+/g, '_')}_BusinessCard.jpg`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = shareImageUrl;
      link.click();
    }
  };

  const handleAiBio = async () => {
    if (!aiKeywords) return;
    setIsAiGenerating(true);
    const enhanced = await generateEnhancedBio(aiKeywords, profile.role);
    setProfile(prev => ({ ...prev, bio: enhanced }));
    setIsAiGenerating(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-900'} relative overflow-hidden`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      {/* Background Decor */}
      <div className={`absolute top-[-5%] left-[-5%] w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-opacity duration-700 ${isDark ? 'bg-blue-600/30' : 'bg-blue-400/40'}`}></div>
      <div className={`absolute bottom-[-5%] right-[-5%] w-[30rem] h-[30rem] rounded-full blur-[120px] pointer-events-none transition-opacity duration-700 ${isDark ? 'bg-purple-600/30' : 'bg-purple-400/40'}`}></div>

      <div className={`w-full max-w-md h-[844px] relative rounded-[3rem] shadow-2xl border-[8px] transition-all duration-500 overflow-hidden flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`}>
        
        {/* Share Overlay */}
        {isSharing && (
          <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="bg-slate-800/50 p-8 rounded-3xl flex flex-col items-center gap-4 border border-white/10 shadow-2xl">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <Share2 size={24} className="absolute inset-0 m-auto text-blue-400" />
              </div>
              <p className="text-lg font-semibold tracking-wide text-white">Generating Card...</p>
            </div>
          </div>
        )}

        {/* Share Center Modal */}
        {showShareModal && shareImageUrl && (
          <div className="absolute inset-0 z-[70] bg-slate-950/98 backdrop-blur-2xl flex flex-col p-8 overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Share2 className="text-blue-500" size={24} />
                <h2 className="text-2xl font-bold text-white">Share Center</h2>
              </div>
              <button onClick={() => setShowShareModal(false)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="w-full aspect-[9/16] bg-slate-800/50 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 p-2">
                <img src={shareImageUrl} alt="Preview" className="w-full h-full object-contain rounded-[1.5rem]" />
              </div>
              <div className="space-y-4">
                <button onClick={downloadCard} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all">
                  <ArrowDownCircle size={22} />
                  Download to Gallery
                </button>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                   <p className="text-xs text-slate-400 leading-relaxed text-center italic">Download the image first, then upload it manually to Instagram or WhatsApp Stories.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={cardRef} className={`flex-1 flex flex-col h-full relative transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
          </div>

          {screen === AppScreen.VIEW ? (
            <div className="flex-1 flex flex-col pt-12 pb-8 px-6 animate-in fade-in duration-500">
              <div className="header-actions flex justify-between items-center mb-6">
                <IconWrapper className={`${isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-200 text-slate-600'}`} onClick={() => setScreen(AppScreen.EDIT)}>
                  <Edit3 size={18} />
                </IconWrapper>
                <div className="flex gap-2">
                  <IconWrapper className={`${isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-200 text-slate-600'}`} onClick={() => setShowQr(true)}>
                    <QrCode size={18} />
                  </IconWrapper>
                  <IconWrapper className={`${isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-200 text-slate-600'}`} onClick={handleShareCard}>
                    <Share2 size={18} />
                  </IconWrapper>
                </div>
              </div>

              {/* Profile Card Section */}
              <div className={`relative flex flex-col items-center pt-8 pb-6 px-4 rounded-[2.5rem] mb-8 border transition-all duration-500 ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="relative mb-4 group">
                  <div className={`w-36 h-36 rounded-full p-1.5 transition-all duration-700 ${isDark ? 'bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-400 shadow-lg shadow-blue-500/20' : 'bg-gradient-to-tr from-blue-300 to-purple-300'}`}>
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.name}
                      className={`w-full h-full rounded-full object-cover border-4 ${isDark ? 'border-slate-900' : 'border-white'}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Better fallback for broken links
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=020617&color=fff&size=512`;
                      }}
                    />
                  </div>
                  <div className="absolute bottom-1 right-3 p-1.5 bg-green-500 rounded-full border-4 border-slate-900 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900">
                    <ShieldCheck size={16} />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h1 className={`text-2xl font-black tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.name}</h1>
                  <p className={`text-sm font-bold uppercase tracking-[0.2em] mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{profile.role}</p>
                  <div className="flex items-center justify-center gap-1.5 opacity-60">
                    <Smartphone size={12} />
                    <span className="text-xs font-medium uppercase tracking-widest">{profile.company}</span>
                  </div>
                </div>

                {/* Embedded Social Identity Chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  <a href={profile.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 rounded-full border border-blue-600/20 transition-all hover:-translate-y-0.5 group">
                    <Facebook size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest">Connect</span>
                  </a>
                  <a href={profile.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-400/10 hover:bg-blue-400/20 rounded-full border border-blue-400/20 transition-all hover:-translate-y-0.5 group">
                    <Twitter size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest">Follow</span>
                  </a>
                  <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 rounded-full border border-green-500/20 transition-all hover:-translate-y-0.5 group">
                    <MessageCircle size={14} className="text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest">Message</span>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <a href={`tel:${profile.phone}`} className="flex flex-col items-center gap-2 group">
                  <IconWrapper className={`${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200'} border w-16 h-16 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-blue-500/20`}>
                    <Phone size={24} />
                  </IconWrapper>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold opacity-50">Call</span>
                </a>
                <a href={`mailto:${profile.email}`} className="flex flex-col items-center gap-2 group">
                  <IconWrapper className={`${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-600 border-purple-200'} border w-16 h-16 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-purple-500/20`}>
                    <Mail size={24} />
                  </IconWrapper>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold opacity-50">Email</span>
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group">
                  <IconWrapper className={`${isDark ? 'bg-white/5 text-white/40 border-white/10' : 'bg-slate-100 text-slate-400 border-slate-200'} border w-16 h-16 group-hover:-translate-y-1 group-hover:text-blue-500 group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/10`}>
                    <Linkedin size={24} />
                  </IconWrapper>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold opacity-50">Profile</span>
                </a>
              </div>

              {/* Bio Section */}
              <div className={`rounded-3xl p-6 mb-8 relative overflow-hidden ${isDark ? 'glass' : 'bg-white border border-slate-200'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 mb-3 flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500 rounded-full"></div>
                  About Me
                </h3>
                <p className={`text-sm leading-relaxed font-medium transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  "{profile.bio}"
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="action-buttons-container mt-auto space-y-3">
                <button 
                  onClick={handleSaveToContacts}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl ${isDark ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/40 hover:shadow-blue-500/60' : 'bg-slate-900 text-white shadow-slate-900/30 hover:shadow-slate-900/40'}`}
                >
                  <Download size={18} />
                  Save to Contacts
                </button>
                <button 
                  onClick={handleCopyContactInfo}
                  className={`w-full py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 border ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
                >
                  {isCopied ? <ClipboardCheck size={16} className="text-green-500" /> : <Copy size={16} />}
                  {isCopied ? 'Info Copied' : 'Copy Contact Info'}
                </button>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex flex-col pt-12 pb-8 px-6 overflow-y-auto animate-in slide-in-from-right duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <div className="flex items-center gap-4 mb-8">
                <IconWrapper className={`${isDark ? 'bg-white/5 text-gray-400' : 'bg-slate-200 text-slate-600'}`} onClick={() => setScreen(AppScreen.VIEW)}>
                  <ArrowLeft size={20} />
                </IconWrapper>
                <h2 className="text-2xl font-bold">Edit Presence</h2>
              </div>
              <div className="space-y-6 pb-12">
                <div className="flex flex-col items-center mb-6">
                   <div className="relative cursor-pointer group" onClick={triggerFileInput}>
                      <img 
                        src={profile.avatarUrl} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 group-hover:opacity-80 transition-all" 
                        alt="Avatar"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=020617&color=fff&size=200`;
                        }}
                      />
                      <div className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full border-2 border-slate-900 shadow-xl text-white"><Camera size={14} /></div>
                   </div>
                </div>
                <InputField label="Name" value={profile.name} onChange={(v) => setProfile({...profile, name: v})} isDark={isDark} />
                <InputField label="Role" value={profile.role} onChange={(v) => setProfile({...profile, role: v})} isDark={isDark} />
                <div className={`rounded-2xl p-4 space-y-3 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-100'}`}>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Bio Enhancement</label>
                    <button onClick={handleAiBio} disabled={isAiGenerating} className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1">
                      <Sparkles size={12} className={isAiGenerating ? 'animate-spin' : ''} /> AI Write
                    </button>
                  </div>
                  <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full bg-transparent border-none focus:ring-0 text-sm h-20 resize-none" placeholder="Keywords..." />
                </div>
                <InputField label="Email" value={profile.email} onChange={(v) => setProfile({...profile, email: v})} isDark={isDark} />
                <InputField label="Phone" value={profile.phone} onChange={(v) => setProfile({...profile, phone: v})} isDark={isDark} />
                <InputField label="Facebook" value={profile.facebook} onChange={(v) => setProfile({...profile, facebook: v})} isDark={isDark} />
                <InputField label="Twitter/X" value={profile.twitter} onChange={(v) => setProfile({...profile, twitter: v})} isDark={isDark} />
                <button onClick={() => setScreen(AppScreen.VIEW)} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20">Save Profile</button>
              </div>
            </div>
          )}
        </div>

        {/* QR Modal */}
        {showQr && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm animate-in zoom-in duration-300">
            <div className={`w-full rounded-[3rem] p-10 border relative flex flex-col items-center ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
              <button onClick={() => setShowQr(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              <h2 className="text-2xl font-black mb-2 text-center uppercase tracking-widest">Connect</h2>
              <p className="text-slate-500 text-[10px] mb-8 uppercase tracking-[0.2em]">Scan to open my digital card</p>
              <div className="p-6 bg-white rounded-[2rem] mb-8 shadow-2xl shadow-blue-500/20">
                <QRCodeSVG value={window.location.href} size={180} level="H" includeMargin={false} imageSettings={{ src: profile.avatarUrl, height: 40, width: 40, excavate: true }} />
              </div>
              <p className="text-lg font-black uppercase tracking-widest">{profile.name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string, value: string, onChange: (val: string) => void, isDark: boolean }> = ({ label, value, onChange, isDark }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} 
    />
  </div>
);

export default App;
