import React, { useState, useEffect } from 'react';
import {
  Cloud, LogOut, Settings, Folder, Image, Video, Music,
  Link as LinkIcon, FileText, Trash2, Share2, Copy,
  FolderPlus, MoveRight, CheckSquare, Sun, Moon, Shield, Gift,
  ChevronLeft, ChevronRight, ChevronDown, Search, Plus, RotateCcw, KeyRound,
  Home, LayoutGrid, User, Camera, UploadCloud, Bell, Filter, Lock
} from 'lucide-react';

type UserData = {
  username: string;
  password: string;
  role: 'user' | 'admin1' | 'admin2' | 'admin3';
  active: boolean;
};

type FileItem = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'link' | 'document' | 'folder';
  createdAt: string;
  folderId?: string;
  deletedAt?: string | null;
};

type View = 'auth' | 'home' | 'mystora' | 'settings' | 'admin' | 'trash';
type Theme = 'sky' | 'night';
type Category = 'semua' | 'image' | 'video' | 'audio' | 'document';

const DEFAULT_GIFT_CODE = '#adminstoraclouds123';

export default function App() {
  const [view, setView] = useState<View>('auth');
  const [theme, setTheme] = useState<Theme>('sky');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState<'none' | 'multiple'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category>('semua');
  const [giftCode, setGiftCode] = useState('');
  const [adminGiftCode, setAdminGiftCode] = useState(DEFAULT_GIFT_CODE);
  const [newGiftCode, setNewGiftCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [giftCodeOpen, setGiftCodeOpen] = useState(false);

  useEffect(() => {
    const savedUsers = localStorage.getItem('stora_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    const savedFiles = localStorage.getItem('stora_files');
    if (savedFiles) setFiles(JSON.parse(savedFiles));
    const savedTheme = localStorage.getItem('stora_theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    const savedCode = localStorage.getItem('stora_admin_code');
    if (savedCode) setAdminGiftCode(savedCode);
  }, []);

  useEffect(() => { localStorage.setItem('stora_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('stora_files', JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem('stora_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('stora_admin_code', adminGiftCode); }, [adminGiftCode]);

  const isValidPassword = (pass: string) => /^\d{6,12}$/.test(pass);

  const handleRegister = () => {
    if (!username.trim()) { alert('Nama pengguna tidak boleh kosong!'); return; }
    if (!isValidPassword(password)) { alert('Sandi HARUS berupa ANGKA, panjang 6–12 digit!'); return; }
    if (password !== confirmPassword) { alert('Sandi tidak cocok!'); return; }
    if (users.find(u => u.username === username)) { alert('Nama pengguna sudah dipakai!'); return; }
    const newUser: UserData = {
      username, password,
      role: users.length === 0 ? 'admin1' : 'user',
      active: true
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setView('home');
    setUsername(''); setPassword(''); setConfirmPassword('');
  };

  const handleLogin = () => {
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) { alert('Nama pengguna atau sandi salah!'); return; }
    if (!found.active) { alert('Akun telah dinonaktifkan!'); return; }
    setCurrentUser(found);
    setView('home');
    setUsername(''); setPassword('');
  };

  const handleLogout = () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar dari akun?')) return;
    setCurrentUser(null);
    setView('auth');
    setSelectMode('none');
    setSelectedFiles([]);
  };

  const handleChangePassword = () => {
    if (!currentUser) return;
    if (!isValidPassword(newPassword)) { alert('Sandi baru HARUS berupa ANGKA, panjang 6–12 digit!'); return; }
    if (newPassword !== newPasswordConfirm) { alert('Konfirmasi sandi baru tidak cocok!'); return; }
    const updated = users.map(u => u.username === currentUser.username ? { ...u, password: newPassword } : u);
    setUsers(updated);
    setCurrentUser({ ...currentUser, password: newPassword });
    setNewPassword(''); setNewPasswordConfirm('');
    alert('Sandi berhasil diperbarui!');
  };

  const handleChangeUsername = () => {
    if (!currentUser) return;
    const trimmed = newUsername.trim();
    if (!trimmed) { alert('Nama pengguna tidak boleh kosong!'); return; }
    if (users.find(u => u.username === trimmed)) { alert('Nama pengguna sudah dipakai!'); return; }
    setUsers(users.map(u => u.username === currentUser.username ? { ...u, username: trimmed } : u));
    setCurrentUser({ ...currentUser, username: trimmed });
    setNewUsername('');
    alert('Nama pengguna berhasil diubah!');
  };

  const redeemCode = () => {
    if (giftCode === adminGiftCode && currentUser) {
      const newRole: UserData['role'] = currentUser.role === 'user' ? 'admin2' :
        currentUser.role === 'admin2' ? 'admin3' : currentUser.role;
      if (newRole === currentUser.role) { alert('Sudah menjadi Admin!'); setGiftCode(''); return; }
      const updated = users.map(u => u.username === currentUser.username ? { ...u, role: newRole } : u);
      setUsers(updated);
      setCurrentUser({ ...currentUser, role: newRole });
      alert('Selamat! Naik jadi Admin berhasil!');
    } else {
      alert('Kode tidak valid!');
    }
    setGiftCode('');
  };

  const saveNewGiftCode = () => {
    if (!newGiftCode.trim()) { alert('Kode tidak boleh kosong!'); return; }
    setAdminGiftCode(newGiftCode.trim());
    setNewGiftCode('');
    alert('Kode hadiah admin berhasil diperbarui!');
  };

  const toggleActive = (targetUser: UserData) => {
    if (!currentUser?.role.startsWith('admin')) return;
    setUsers(users.map(u => u.username === targetUser.username ? { ...u, active: !u.active } : u));
  };

  const revokeAdmin = (targetUser: UserData) => {
    if (!currentUser?.role.startsWith('admin')) return;
    if (targetUser.role === 'admin1') { alert('Tidak dapat mencabut hak Pemilik Utama!'); return; }
    setUsers(users.map(u => u.username === targetUser.username ? { ...u, role: 'user' as const } : u));
  };

  const moveToTrash = (ids: string[]) => {
    setFiles(files.map(f => ids.includes(f.id) ? { ...f, deletedAt: new Date().toISOString() } : f));
    setSelectedFiles([]);
    setSelectMode('none');
  };

  const restoreFromTrash = (id: string) => setFiles(files.map(f => (f.id === id ? { ...f, deletedAt: null } : f)));

  const deleteForever = (id: string) => {
    if (confirm('Hapus permanen? Berkas tidak dapat dikembalikan lagi.')) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  const addFile = (type: FileItem['type']) => {
    const name = prompt(type === 'folder' ? 'Nama folder baru:' : `Nama ${type} baru:`);
    if (name && name.trim()) {
      setFiles([...files, {
        id: `f-${Date.now()}`, name: name.trim(), type,
        createdAt: new Date().toISOString(), deletedAt: null
      }]);
    }
  };

  // ---------- Theme tokens ----------
  const isNight = theme === 'night';
  const pageBg = isNight
    ? 'bg-slate-950 text-slate-100'
    : 'bg-slate-50 text-slate-800';
  const heroGradient = isNight
    ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-black'
    : 'bg-gradient-to-br from-sky-500 via-sky-400 to-cyan-300';
  const cardClass = isNight
    ? 'bg-slate-800 border border-slate-700 text-slate-100'
    : 'bg-white border border-slate-100 text-slate-800 shadow-sm';
  const btnPrimary = 'bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white shadow-sm';
  const inputClass = isNight
    ? 'bg-slate-800 border-slate-600 focus:border-sky-400 text-slate-100'
    : 'bg-white border-slate-200 focus:border-sky-400 text-slate-800';
  const softBg = isNight ? 'bg-slate-900' : 'bg-slate-100';

  const activeFiles = files.filter(f => !f.deletedAt);
  const trashedFiles = files.filter(f => !!f.deletedAt);

  const categoryFiltered = activeFiles.filter(f => category === 'semua' ? true : f.type === category);
  const filteredFiles = categoryFiltered.filter(f =>
    !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const iconMeta: Record<FileItem['type'], { icon: React.ReactNode; grad: string }> = {
    image: { icon: <Image size={22} className="text-white" />, grad: 'from-sky-400 to-blue-500' },
    video: { icon: <Video size={22} className="text-white" />, grad: 'from-slate-700 to-slate-900' },
    audio: { icon: <Music size={22} className="text-white" />, grad: 'from-rose-400 to-pink-500' },
    link: { icon: <LinkIcon size={22} className="text-white" />, grad: 'from-emerald-400 to-teal-500' },
    document: { icon: <FileText size={22} className="text-white" />, grad: 'from-amber-400 to-orange-500' },
    folder: { icon: <Folder size={22} className="text-white" />, grad: 'from-yellow-400 to-amber-500' },
  };

  const FileIconBadge = ({ type, size = 64 }: { type: FileItem['type']; size?: number }) => {
    const meta = iconMeta[type];
    if (type === 'folder') {
      // Skeuomorphic folder shape: small tab + body, like a real folder icon
      return (
        <div className="relative" style={{ width: size, height: size * 0.82 }}>
          <div
            className={`absolute top-0 left-0 rounded-t-md bg-gradient-to-br ${meta.grad} opacity-95`}
            style={{ width: size * 0.42, height: size * 0.2 }}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 rounded-xl rounded-tl-none bg-gradient-to-br ${meta.grad} flex items-center justify-center shadow-md`}
            style={{ height: size * 0.72 }}
          >
            {meta.icon}
          </div>
        </div>
      );
    }
    return (
      <div
        className={`rounded-2xl bg-gradient-to-br ${meta.grad} flex items-center justify-center shadow-md ring-2 ${isNight ? 'ring-white/10' : 'ring-white/40'}`}
        style={{ width: size, height: size }}
      >
        {meta.icon}
      </div>
    );
  };

  const categoryTabs: { key: Category; label: string }[] = [
    { key: 'semua', label: 'Semua' },
    { key: 'image', label: 'Foto' },
    { key: 'video', label: 'Video' },
    { key: 'audio', label: 'Musik' },
    { key: 'document', label: 'Dokumen' },
  ];

  const BackButton = ({ to = 'home' as View }) => (
    <button onClick={() => setView(to)} className="flex items-center gap-1 text-sm font-medium opacity-70 hover:opacity-100 mb-4">
      <ChevronLeft size={18} /> Kembali
    </button>
  );

  // ---------- Bottom navigation ----------
  const BottomNav = () => {
    if (!currentUser) return null;
    const items: { key: View; label: string; icon: React.ReactNode }[] = [
      { key: 'home', label: 'Beranda', icon: <Home size={22} /> },
      { key: 'mystora', label: 'My Stora', icon: <LayoutGrid size={22} /> },
      { key: 'trash', label: 'Sampah', icon: <Trash2 size={22} /> },
      ...(currentUser.role.startsWith('admin')
        ? [{ key: 'admin' as View, label: 'Admin', icon: <Shield size={22} /> }]
        : []),
      { key: 'settings', label: 'Profil', icon: <User size={22} /> },
    ];
    return (
      <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t ${isNight ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="max-w-3xl mx-auto flex justify-around py-2">
          {items.map(item => (
            <button
              key={item.key}
              onClick={() => { setView(item.key); setSelectMode('none'); setSelectedFiles([]); }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                view === item.key ? 'text-sky-500' : 'opacity-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    );
  };

  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300 ${currentUser ? 'pb-20' : ''}`}>
      {view === 'auth' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className={`w-full max-w-md p-8 rounded-2xl ${cardClass}`}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center mb-3">
                <Cloud size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
                STORA CLOUDS ID
              </h1>
              <p className="text-sm opacity-60 mt-1">Penyimpanan Aman & Cepat</p>
            </div>

            <div className={`flex mb-6 rounded-xl overflow-hidden border ${isNight ? 'border-slate-700' : 'border-slate-200'}`}>
              <button onClick={() => setAuthTab('login')} className={`flex-1 py-2 font-medium transition-all ${authTab === 'login' ? btnPrimary : ''}`}>Masuk</button>
              <button onClick={() => setAuthTab('register')} className={`flex-1 py-2 font-medium transition-all ${authTab === 'register' ? btnPrimary : ''}`}>Daftar</button>
            </div>

            {authTab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium opacity-70">Nama Pengguna</label>
                  <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="contoh: budi.santoso"
                    className={`w-full mt-1 px-4 py-3 rounded-xl border ${inputClass} outline-none transition`} />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Kata Sandi (Hanya Angka 6–12)</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="____________" maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-xl border ${inputClass} outline-none transition`} />
                </div>
                <button onClick={handleLogin} className={`w-full py-3 rounded-xl font-semibold ${btnPrimary} transition-transform active:scale-95`}>Masuk</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium opacity-70">Nama Pengguna</label>
                  <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="contoh: budi.santoso"
                    className={`w-full mt-1 px-4 py-3 rounded-xl border ${inputClass} outline-none transition`} />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Kata Sandi (Hanya Angka 6–12)</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="6–12 digit angka" maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-xl border ${inputClass} outline-none transition`} />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Ulangi Kata Sandi</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="Sama seperti di atas" maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-xl border ${inputClass} outline-none transition`} />
                </div>
                <button onClick={handleRegister} className={`w-full py-3 rounded-xl font-semibold ${btnPrimary} transition-transform active:scale-95`}>Daftar</button>
                <p className="text-xs text-center opacity-50">Akun pertama = Otomatis jadi Admin 1</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'home' && currentUser && (
        <main>
          <div className={`${heroGradient} px-5 pt-6 pb-10 rounded-b-3xl text-white`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-bold text-lg">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Cloud size={20} className="text-white" />
                </div>
                <span>STORA CLOUDS ID</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme(isNight ? 'sky' : 'night')}
                  title={isNight ? 'Mode Terang' : 'Mode Gelap'}
                  className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
                >
                  {isNight ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={handleLogout} title="Keluar" className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            <div className="flex gap-5 text-sm font-medium opacity-90 mb-1">
              <span className="border-b-2 border-white pb-1">My Stora</span>
              <button onClick={() => setView('settings')} className="pb-1 opacity-80">Pengaturan</button>
              {currentUser.role.startsWith('admin') && (
                <button onClick={() => setView('admin')} className="pb-1 opacity-80">Admin</button>
              )}
            </div>
          </div>

          <div className="px-5 -mt-6">
            <div className={`p-5 rounded-2xl ${cardClass}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold mb-1">Selamat Datang, {currentUser.username}! 👋</h2>
                  <p className="text-sm opacity-60">Penyimpananmu aman di STORA CLOUDS ID</p>
                </div>
                <button
                  onClick={() => setView('mystora')}
                  title="Filter"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${softBg} opacity-70`}
                >
                  <Filter size={14} />
                </button>
              </div>
              {currentUser.role.startsWith('admin') && (
                <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  👑 {currentUser.role.toUpperCase()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => setView('mystora')} className="p-5 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white text-left relative overflow-hidden">
                <Cloud size={40} className="absolute -right-2 -bottom-2 opacity-30" />
                <div className="flex items-center gap-1 relative z-10">
                  <p className="font-semibold">My Stora</p>
                  <ChevronDown size={14} />
                </div>
                <p className="text-xs opacity-80 relative z-10">Pengaturan</p>
              </button>
              <button onClick={() => setView('trash')} className={`p-5 rounded-2xl ${cardClass} text-left`}>
                <Trash2 size={28} className="text-rose-500 mb-2" />
                <p className="font-semibold">Sampah</p>
                <p className="text-xs opacity-50">{trashedFiles.length} berkas</p>
              </button>
            </div>

            <div className={`mt-4 p-4 rounded-2xl ${cardClass} flex items-center justify-between`}>
              <span className="text-sm font-medium">1.2 GB / Tak Terbatas</span>
              <ChevronRight size={18} className="opacity-40" />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <h3 className="font-bold">Galeri</h3>
              <button onClick={() => setView('mystora')} className="text-xs font-medium text-sky-500">Lihat semua</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {activeFiles.length === 0 ? (
                <p className="col-span-3 text-sm opacity-40 text-center py-6">Belum ada berkas — buka My Stora untuk menambahkan.</p>
              ) : (
                activeFiles.slice(0, 6).map(file => (
                  <div key={file.id} className={`p-3 rounded-2xl ${cardClass} flex flex-col items-center gap-2`}>
                    <FileIconBadge type={file.type} size={48} />
                    <p className="text-xs font-medium truncate w-full text-center">{file.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {view === 'mystora' && currentUser && (
        <main className="px-5 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Cloud size={22} className="text-sky-500" />
              <span>STORA CLOUDS ID</span>
            </div>
            <button
              onClick={() => setTheme(isNight ? 'sky' : 'night')}
              title={isNight ? 'Mode Terang' : 'Mode Gelap'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${cardClass}`}
            >
              {isNight ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <div className={`flex items-center gap-2 p-3 rounded-2xl ${cardClass} mb-4`}>
            <Search size={18} className="opacity-40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari file, foto, video, musik..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={() => { setSelectMode(selectMode === 'none' ? 'multiple' : 'none'); setSelectedFiles([]); }}
              className={`text-xs font-medium px-2 py-1 rounded-lg ${selectMode !== 'none' ? btnPrimary : 'opacity-60'}`}
            >
              Pilih Banyak
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
            {categoryTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  category === tab.key ? btnPrimary : `${softBg} opacity-70`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {selectMode !== 'none' && selectedFiles.length > 0 && (
            <div className={`mb-4 p-3 rounded-xl ${cardClass} flex flex-wrap gap-2`}>
              <span className="text-sm font-medium mr-2">{selectedFiles.length} dipilih</span>
              <button onClick={() => { if (confirm(`Pindahkan ${selectedFiles.length} berkas ke Sampah?`)) moveToTrash(selectedFiles); }}
                className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm flex items-center gap-1"><Trash2 size={14} /> Hapus</button>
              <button onClick={() => alert('Pilih folder tujuan untuk memindahkan')}
                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm flex items-center gap-1"><MoveRight size={14} /> Pindahkan</button>
              <button onClick={() => { setSelectMode('none'); setSelectedFiles([]); }}
                className="px-3 py-1.5 bg-slate-400 text-white rounded-lg text-sm">Batal</button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-28">
            {filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-12 opacity-40">
                <Folder size={48} className="mx-auto mb-3" />
                <p>Belum ada berkas di kategori ini</p>
              </div>
            ) : (
              filteredFiles.map(file => (
                <div
                  key={file.id}
                  onClick={() => selectMode !== 'none' && setSelectedFiles(prev =>
                    prev.includes(file.id) ? prev.filter(id => id !== file.id) : [...prev, file.id]
                  )}
                  className={`relative p-4 rounded-2xl ${cardClass} cursor-pointer transition-all ${
                    selectedFiles.includes(file.id) ? 'ring-2 ring-sky-500' : ''
                  }`}
                >
                  {selectMode !== 'none' && (
                    <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedFiles.includes(file.id) ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300'
                    }`}>
                      {selectedFiles.includes(file.id) && <CheckSquare size={12} />}
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center gap-2">
                    <FileIconBadge type={file.type} />
                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                  </div>
                  {selectMode === 'none' && (
                    <div className="flex justify-center gap-2 mt-3">
                      <button onClick={(e) => { e.stopPropagation(); alert(`Membagikan "${file.name}"`); }} className="p-1.5 rounded hover:bg-sky-100/50"><Share2 size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(file.name); }} className="p-1.5 rounded hover:bg-sky-100/50"><Copy size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveToTrash([file.id]); }} className="p-1.5 rounded hover:bg-rose-100/50 text-rose-500"><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="fixed bottom-20 left-0 right-0 px-5">
            <div className="max-w-md mx-auto flex gap-2 p-2 rounded-full bg-sky-500 shadow-lg">
              <button onClick={() => addFile('document')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white text-sky-600 font-medium text-sm">
                <UploadCloud size={16} /> Unggah File
              </button>
              <button onClick={() => addFile('folder')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-medium text-sm">
                <FolderPlus size={16} /> Buat Folder
              </button>
            </div>
          </div>
        </main>
      )}

      {view === 'trash' && currentUser && (
        <main className="px-5 pt-6">
          <BackButton />
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trash2 size={22} className="text-rose-500" /> Sampah</h2>
          {trashedFiles.length === 0 ? (
            <div className="text-center py-12 opacity-40"><Trash2 size={48} className="mx-auto mb-3" /><p>Sampah kosong</p></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {trashedFiles.map(file => (
                <div key={file.id} className={`p-4 rounded-2xl ${cardClass} opacity-80`}>
                  <div className="flex flex-col items-center text-center gap-2">
                    <FileIconBadge type={file.type} />
                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                  </div>
                  <div className="flex justify-center gap-2 mt-3">
                    <button onClick={() => restoreFromTrash(file.id)} className="p-1.5 rounded hover:bg-emerald-100/50 text-emerald-500"><RotateCcw size={14} /></button>
                    <button onClick={() => deleteForever(file.id)} className="p-1.5 rounded hover:bg-rose-100/50 text-rose-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {view === 'settings' && currentUser && (
        <main className="px-5 pt-6">
          <div className="flex items-center justify-between mb-6 gap-2">
            <button onClick={() => setView('home')} className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cardClass}`}>
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="opacity-60 whitespace-nowrap">Kembali ke</span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${btnPrimary}`}>My Stora</span>
            </div>
            <button
              onClick={() => alert('Belum ada notifikasi baru')}
              title="Notifikasi"
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cardClass}`}
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Pengaturan</h2>

          <h3 className="font-bold mb-3">Tema</h3>
          <div className="flex gap-3 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
            <button onClick={() => setTheme('sky')} className={`flex-shrink-0 w-36 aspect-square rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex flex-col items-center justify-center text-white relative ${theme === 'sky' ? 'ring-4 ring-sky-300' : ''}`}>
              <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Plus size={14} /></span>
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center mb-2"><CheckSquare size={18} className="text-sky-500" /></div>
              <span className="font-semibold text-sm">Biru Langit</span>
            </button>
            <button onClick={() => setTheme('night')} className={`flex-shrink-0 w-36 aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-black flex flex-col items-center justify-center text-white relative ${theme === 'night' ? 'ring-4 ring-slate-400' : ''}`}>
              <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Plus size={14} /></span>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2"><Moon size={18} /></div>
              <span className="font-semibold text-sm">Hitam Malam</span>
            </button>
            <div className={`flex-shrink-0 w-36 aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center opacity-50 ${isNight ? 'border-slate-700' : 'border-slate-300'}`}>
              <Lock size={20} className="mb-2" />
              <span className="font-semibold text-xs text-center px-3">Tema Baru Segera</span>
            </div>
          </div>

          <h3 className="font-bold mb-3">Akun</h3>
          <div className={`rounded-3xl ${cardClass} divide-y ${isNight ? 'divide-slate-700' : 'divide-slate-100'} mb-6`}>
            <button onClick={() => alert('Fitur unggah foto profil belum tersedia di demo ini.')} className="w-full flex items-center gap-3 p-4 text-left">
              <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-500"><Camera size={16} /></div>
              <div className="flex-1">
                <p className="font-medium text-sm">Ubah Foto Profil</p>
                <p className="text-xs opacity-50">Perbarui foto akunmu</p>
              </div>
              <ChevronRight size={18} className="opacity-30" />
            </button>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-500"><User size={16} /></div>
                <div>
                  <p className="font-medium text-sm">Ubah Nama Pengguna</p>
                  <p className="text-xs opacity-50">Saat ini: {currentUser.username}</p>
                </div>
              </div>
              <div className="flex gap-2 pl-12">
                <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Nama pengguna baru"
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm ${inputClass} outline-none`} />
                <button onClick={handleChangeUsername} className={`px-3 py-2 rounded-lg text-sm font-medium ${btnPrimary}`}>Simpan</button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-500"><KeyRound size={16} /></div>
                <p className="font-medium text-sm">Ubah Kata Sandi</p>
              </div>
              <div className="space-y-2 pl-12">
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, ''))}
                  placeholder="Sandi baru (6–12 digit)" maxLength={12}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${inputClass} outline-none`} />
                <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ulangi sandi baru" maxLength={12}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${inputClass} outline-none`} />
                <button onClick={handleChangePassword} className={`w-full py-2 rounded-lg text-sm font-medium ${btnPrimary}`}>Simpan Sandi</button>
              </div>
            </div>
          </div>

          <h3 className="font-bold mb-3 flex items-center gap-2"><Gift size={16} /> Hadiah Admin</h3>
          <div className={`flex gap-2 p-2 rounded-full ${cardClass} mb-6`}>
            <input value={giftCode} onChange={(e) => setGiftCode(e.target.value)} placeholder="Kode hadiah"
              className="flex-1 px-3 py-2 bg-transparent outline-none text-sm" />
            <button onClick={redeemCode} className={`px-5 py-2 rounded-full text-sm font-medium ${btnPrimary}`}>Tukar</button>
          </div>

          <button onClick={handleLogout} className={`w-full py-3 rounded-full font-semibold ${btnPrimary} flex items-center justify-center gap-2 mb-8`}>
            <LogOut size={16} /> Keluar Akun
          </button>
        </main>
      )}

      {view === 'admin' && currentUser && currentUser.role.startsWith('admin') && (
        <main>
          <div className={`${heroGradient} px-5 pt-6 pb-8 rounded-b-3xl text-white`}>
            <div className="flex items-center justify-between">
              <button onClick={() => setView('home')} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold tracking-wide">RUANG ADMIN</h2>
              <button className="text-sm font-medium opacity-90" onClick={() => setView('home')}>Kembali</button>
            </div>
          </div>

          <div className="px-5 -mt-5">
            <div className={`rounded-3xl ${cardClass} p-4 mb-6`}>
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 className="font-bold text-lg">Nama Pengguna</h3>
                <button
                  onClick={() => setView('home')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${isNight ? 'border-slate-600 text-sky-300' : 'border-sky-200 text-sky-600'}`}
                >
                  Kembali
                </button>
              </div>
              <div className="grid grid-cols-[24px_1fr_auto_auto] gap-3 text-xs font-semibold opacity-50 mb-2 px-1">
                <span></span><span>Pengguna</span><span>Peran</span><span>Aksi</span>
              </div>
              <div className={`divide-y ${isNight ? 'divide-slate-700' : 'divide-slate-100'}`}>
                {users.length === 0 ? (
                  <p className="text-sm opacity-40 text-center py-6">Belum ada pengguna</p>
                ) : users.map(u => (
                  <div key={u.username} className="grid grid-cols-[24px_1fr_auto_auto] gap-3 items-center py-3 px-1">
                    <button
                      onClick={() => setSelectedUsers(prev => prev.includes(u.username) ? prev.filter(x => x !== u.username) : [...prev, u.username])}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedUsers.includes(u.username) ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300'
                      }`}
                    >
                      {selectedUsers.includes(u.username) && <CheckSquare size={12} />}
                    </button>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{u.username}</p>
                      <p className="text-xs opacity-50">{u.active ? 'Aktif' : 'Nonaktif'}</p>
                    </div>
                    <span className="text-xs font-medium opacity-70 whitespace-nowrap">
                      {u.role === 'user' ? 'Pengguna' : u.role.toUpperCase()}
                    </span>
                    <div className="flex flex-col gap-1 items-end">
                      <button
                        onClick={() => toggleActive(u)}
                        disabled={u.role === 'admin1'}
                        className="text-xs font-medium text-sky-500 disabled:opacity-30"
                      >
                        {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      {u.role.startsWith('admin') && u.role !== 'admin1' && (
                        <button onClick={() => revokeAdmin(u)} className="text-xs font-medium text-rose-500">Cabut Hak</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentUser.role === 'admin1' && (
              <div className={`rounded-3xl ${cardClass} p-4 mb-8`}>
                <button
                  onClick={() => setGiftCodeOpen(!giftCodeOpen)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-bold">Ubah Kode Hadiah Admin</h3>
                  <ChevronDown size={18} className={`opacity-50 transition-transform ${giftCodeOpen ? 'rotate-180' : ''}`} />
                </button>
                {giftCodeOpen && (
                  <div className="mt-3">
                    <p className="text-xs opacity-50 mb-3">Atur kode rahasia yang bisa ditukar pengguna untuk naik menjadi admin.</p>
                    <p className="text-xs opacity-50 mb-3">Kode saat ini: <span className="font-mono">{adminGiftCode}</span></p>
                    <input value={newGiftCode} onChange={(e) => setNewGiftCode(e.target.value)} placeholder="Kode hadiah baru"
                      className={`w-full mb-3 px-4 py-3 rounded-xl border text-sm ${inputClass} outline-none`} />
                    <button onClick={saveNewGiftCode} className={`w-full py-3 rounded-full font-semibold ${btnPrimary}`}>Simpan</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      <BottomNav />
    </div>
  );
}
