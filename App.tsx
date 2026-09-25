import React, { useState, useEffect } from 'react';
import {
  Cloud, LogOut, Settings, Folder, Image, Video, Music,
  Link as LinkIcon, FileText, Trash2, Share2, Copy, PenTool,
  FolderPlus, MoveRight, CheckSquare, List, Sun, Moon, Shield, Gift,
  ChevronLeft, Search, MoreVertical, Plus, RotateCcw, KeyRound
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
  const [selectMode, setSelectMode] = useState<'none' | 'multiple' | 'all'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [giftCode, setGiftCode] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  useEffect(() => {
    const savedUsers = localStorage.getItem('stora_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    const savedFiles = localStorage.getItem('stora_files');
    if (savedFiles) setFiles(JSON.parse(savedFiles));
    const savedTheme = localStorage.getItem('stora_theme') as Theme | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('stora_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('stora_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('stora_theme', theme);
  }, [theme]);

  const isValidPassword = (pass: string) => /^\d{6,12}$/.test(pass);

  const handleRegister = () => {
    if (!username.trim()) {
      alert('Nama pengguna tidak boleh kosong!');
      return;
    }
    if (!isValidPassword(password)) {
      alert('Sandi HARUS berupa ANGKA, panjang 6–12 digit!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Sandi tidak cocok!');
      return;
    }
    if (users.find(u => u.username === username)) {
      alert('Nama pengguna sudah dipakai!');
      return;
    }
    const newUser: UserData = {
      username,
      password,
      role: users.length === 0 ? 'admin1' : 'user',
      active: true
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setView('home');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = () => {
    const found = users.find(
      u => u.username === username && u.password === password
    );
    if (!found) {
      alert('Nama pengguna atau sandi salah!');
      return;
    }
    if (!found.active) {
      alert('Akun telah dinonaktifkan!');
      return;
    }
    setCurrentUser(found);
    setView('home');
    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('auth');
    setSelectMode('none');
    setSelectedFiles([]);
  };

  const handleChangePassword = () => {
    if (!currentUser) return;
    if (!isValidPassword(newPassword)) {
      alert('Sandi baru HARUS berupa ANGKA, panjang 6–12 digit!');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      alert('Konfirmasi sandi baru tidak cocok!');
      return;
    }
    const updated = users.map(u =>
      u.username === currentUser.username ? { ...u, password: newPassword } : u
    );
    setUsers(updated);
    setCurrentUser({ ...currentUser, password: newPassword });
    setNewPassword('');
    setNewPasswordConfirm('');
    alert('Sandi berhasil diperbarui!');
  };

  const redeemCode = () => {
    if (giftCode === '#adminstoraclouds123' && currentUser) {
      const newRole = currentUser.role === 'user' ? 'admin2' :
        currentUser.role === 'admin2' ? 'admin3' : currentUser.role;
      if (newRole === currentUser.role) {
        alert('Sudah menjadi Admin!');
        setGiftCode('');
        return;
      }
      const updated = users.map(u =>
        u.username === currentUser.username ? { ...u, role: newRole } : u
      );
      setUsers(updated);
      setCurrentUser({ ...currentUser, role: newRole });
      alert('Selamat! Naik jadi Admin berhasil!');
    } else {
      alert('Kode tidak valid!');
    }
    setGiftCode('');
  };

  const toggleActive = (targetUser: UserData) => {
    if (!currentUser?.role.startsWith('admin')) return;
    const updated = users.map(u =>
      u.username === targetUser.username ? { ...u, active: !u.active } : u
    );
    setUsers(updated);
  };

  const revokeAdmin = (targetUser: UserData) => {
    if (!currentUser?.role.startsWith('admin')) return;
    if (targetUser.role === 'admin1') {
      alert('Tidak dapat mencabut hak Pemilik Utama!');
      return;
    }
    const updated = users.map(u =>
      u.username === targetUser.username ? { ...u, role: 'user' as const } : u
    );
    setUsers(updated);
  };

  const moveToTrash = (ids: string[]) => {
    setFiles(files.map(f =>
      ids.includes(f.id) ? { ...f, deletedAt: new Date().toISOString() } : f
    ));
    setSelectedFiles([]);
    setSelectMode('none');
  };

  const restoreFromTrash = (id: string) => {
    setFiles(files.map(f => (f.id === id ? { ...f, deletedAt: null } : f)));
  };

  const deleteForever = (id: string) => {
    if (confirm('Hapus permanen? Berkas tidak dapat dikembalikan lagi.')) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  const addFile = (type: FileItem['type']) => {
    const name = prompt(
      type === 'folder' ? 'Nama folder baru:' : `Nama ${type} baru:`
    );
    if (name && name.trim()) {
      setFiles([...files, {
        id: `f-${Date.now()}`,
        name: name.trim(),
        type,
        createdAt: new Date().toISOString(),
        deletedAt: null
      }]);
    }
    setShowAddMenu(false);
  };

  const themeClass = theme === 'sky'
    ? 'bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-800'
    : 'bg-slate-900 text-slate-100';
  const cardClass = theme === 'sky'
    ? 'bg-white/80 shadow-md border border-sky-100'
    : 'bg-slate-800/80 shadow-md border border-slate-700';
  const btnPrimary = theme === 'sky'
    ? 'bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white'
    : 'bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white';
  const inputClass = theme === 'sky'
    ? 'bg-slate-50 border-sky-200 focus:border-sky-400'
    : 'bg-slate-800 border-slate-600 focus:border-sky-400';
  const headerClass = theme === 'sky' ? 'bg-white/70' : 'bg-slate-900/70';

  const activeFiles = files.filter(f => !f.deletedAt);
  const trashedFiles = files.filter(f => !!f.deletedAt);

  const filteredFiles = activeFiles.filter(f =>
    !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'image': return <Image size={28} className="text-sky-500" />;
      case 'video': return <Video size={28} className="text-indigo-500" />;
      case 'audio': return <Music size={28} className="text-rose-500" />;
      case 'link': return <LinkIcon size={28} className="text-emerald-500" />;
      case 'document': return <FileText size={28} className="text-amber-500" />;
      case 'folder': return <Folder size={28} className="text-yellow-500" />;
    }
  };

  const BackButton = ({ to = 'home' as View }) => (
    <button
      onClick={() => setView(to)}
      className="flex items-center gap-1 text-sm font-medium opacity-70 hover:opacity-100 mb-4"
    >
      <ChevronLeft size={18} /> Kembali
    </button>
  );

  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-300`}>
      {view === 'auth' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className={`w-full max-w-md p-8 rounded-2xl ${cardClass}`}>
            <div className="text-center mb-8">
              <Cloud size={48} className="mx-auto text-sky-500 mb-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
                STORA CLOUDS ID
              </h1>
              <p className="text-sm opacity-60 mt-1">Penyimpanan Aman & Cepat</p>
            </div>

            <div className="flex mb-6 rounded-lg overflow-hidden border">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 font-medium transition-all ${authTab === 'login' ? btnPrimary : ''}`}
              >Masuk</button>
              <button
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 font-medium transition-all ${authTab === 'register' ? btnPrimary : ''}`}
              >Daftar</button>
            </div>

            {authTab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium opacity-70">Nama Pengguna</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="contoh: budi.santoso"
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Kata Sandi (Hanya Angka 6–12)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="____________"
                    maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className={`w-full py-3 rounded-lg font-semibold ${btnPrimary} transition-transform active:scale-95`}
                >Masuk</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium opacity-70">Nama Pengguna</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="contoh: budi.santoso"
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Kata Sandi (Hanya Angka 6–12)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="6–12 digit angka"
                    maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Ulangi Kata Sandi</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="Sama seperti di atas"
                    maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <button
                  onClick={handleRegister}
                  className={`w-full py-3 rounded-lg font-semibold ${btnPrimary} transition-transform active:scale-95`}
                >Daftar</button>
                <p className="text-xs text-center opacity-50">Akun pertama = Otomatis jadi Admin 1</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view !== 'auth' && currentUser && (
        <header className={`sticky top-0 z-50 px-4 py-3 border-b backdrop-blur-md ${headerClass}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 font-bold text-lg"
            >
              <Cloud size={24} className="text-sky-500" />
              <span className="hidden sm:inline">STORA CLOUDS ID</span>
            </button>

            <div className="flex items-center gap-3">
              {view === 'mystora' && (
                <>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari..."
                      className={`pl-9 pr-3 py-2 rounded-lg border ${inputClass} outline-none w-40 sm:w-60`}
                    />
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => { setShowAddMenu(!showAddMenu); setShowMenu(false); }}
                      className="p-2 rounded-lg border hover:bg-sky-100/50 transition"
                    >
                      <Plus size={18} />
                    </button>
                    {showAddMenu && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-lg ${cardClass} shadow-lg p-2 z-50`}>
                        <button onClick={() => addFile('folder')} className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left">
                          <FolderPlus size={16} /> Folder
                        </button>
                        <button onClick={() => addFile('image')} className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left">
                          <Image size={16} /> Gambar
                        </button>
                        <button onClick={() => addFile('video')} className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left">
                          <Video size={16} /> Video
                        </button>
                        <button onClick={() => addFile('audio')} className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left">
                          <Music size={16} /> Audio
                        </button>
                        <button onClick={() => addFile('document')} className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left">
                          <FileText size={16} /> Dokumen
                        </button>
                        <button onClick={() => addFile('link')} className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left">
                          <LinkIcon size={16} /> Tautan
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => { setShowMenu(!showMenu); setShowAddMenu(false); }}
                      className="p-2 rounded-lg border hover:bg-sky-100/50 transition"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {showMenu && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-lg ${cardClass} shadow-lg p-2 z-50`}>
                        <button
                          onClick={() => { setSelectMode('multiple'); setSelectedFiles([]); setShowMenu(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left"
                        >
                          <CheckSquare size={16} /> Pilih Beberapa
                        </button>
                        <button
                          onClick={() => { setSelectMode('all'); setSelectedFiles(filteredFiles.map(f => f.id)); setShowMenu(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left"
                        >
                          <List size={16} /> Pilih Semua
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2 rounded-lg border hover:bg-rose-100/50 transition text-rose-500"
              >
                <LogOut size={18} />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{currentUser.username}</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {view === 'home' && currentUser && (
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Selamat Datang, {currentUser.username}! 👋
            </h2>
            <p className="opacity-60">Penyimpananmu aman di STORA CLOUDS ID</p>
            {currentUser.role.startsWith('admin') && (
              <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                👑 {currentUser.role.toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => { setView('mystora'); setSelectMode('none'); setSelectedFiles([]); }}
              className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
            >
              <Folder size={32} className="text-sky-500 mb-3" />
              <h3 className="font-semibold">My Stora</h3>
              <p className="text-xs opacity-50 mt-1">Berkas & Galeri</p>
            </button>

            <button
              onClick={() => setView('settings')}
              className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
            >
              <Settings size={32} className="text-slate-500 mb-3" />
              <h3 className="font-semibold">Pengaturan</h3>
              <p className="text-xs opacity-50 mt-1">Akun & Tema</p>
            </button>

            <button
              onClick={() => setView('trash')}
              className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
            >
              <Trash2 size={32} className="text-rose-500 mb-3" />
              <h3 className="font-semibold">Sampah</h3>
              <p className="text-xs opacity-50 mt-1">{trashedFiles.length} Berkas Dihapus</p>
            </button>

            {currentUser.role.startsWith('admin') && (
              <button
                onClick={() => setView('admin')}
                className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
              >
                <Shield size={32} className="text-amber-500 mb-3" />
                <h3 className="font-semibold">Ruang Admin</h3>
                <p className="text-xs opacity-50 mt-1">Kelola Pengguna</p>
              </button>
            )}
          </div>
        </main>
      )}

      {view === 'mystora' && currentUser && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {selectMode !== 'none' && selectedFiles.length > 0 && (
            <div className={`mb-4 p-3 rounded-lg ${cardClass} flex flex-wrap gap-2`}>
              <span className="text-sm font-medium mr-2">{selectedFiles.length} dipilih</span>
              <button
                onClick={() => {
                  if (confirm(`Pindahkan ${selectedFiles.length} berkas ke Sampah?`)) {
                    moveToTrash(selectedFiles);
                  }
                }}
                className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <Trash2 size={14} /> Hapus
              </button>
              <button
                onClick={() => { alert('Pilih folder tujuan untuk memindahkan'); }}
                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <MoveRight size={14} /> Pindahkan
              </button>
              <button
                onClick={() => { setSelectMode('none'); setSelectedFiles([]); }}
                className="px-3 py-1.5 bg-slate-400 text-white rounded-lg text-sm"
              >Batal</button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-12 opacity-40">
                <Folder size={48} className="mx-auto mb-3" />
                <p>Belum ada berkas</p>
                <button
                  onClick={() => addFile('folder')}
                  className={`mt-3 px-4 py-2 rounded-lg ${btnPrimary} text-sm`}
                >+ Buat Folder Pertama</button>
              </div>
            ) : (
              filteredFiles.map(file => (
                <div
                  key={file.id}
                  onClick={() => {
                    if (selectMode !== 'none') {
                      setSelectedFiles(prev =>
                        prev.includes(file.id)
                          ? prev.filter(id => id !== file.id)
                          : [...prev, file.id]
                      );
                    }
                  }}
                  className={`relative p-4 rounded-xl ${cardClass} cursor-pointer transition-all hover:scale-105 ${
                    selectedFiles.includes(file.id) ? 'ring-2 ring-sky-500' : ''
                  }`}
                >
                  {selectMode !== 'none' && (
                    <div className="absolute top-2 left-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedFiles.includes(file.id)
                          ? 'bg-sky-500 border-sky-500 text-white'
                          : 'border-slate-300'
                      }`}>
                        {selectedFiles.includes(file.id) && <CheckSquare size={12} />}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center gap-2">
                    {getFileIcon(file.type)}
                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                    <p className="text-xs opacity-40">
                      {new Date(file.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {selectMode === 'none' && (
                    <div className="flex justify-center gap-2 mt-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); alert(`Membagikan "${file.name}"`); }}
                        className="p-1.5 rounded hover:bg-sky-100/50"
                        title="Bagikan"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(file.name); }}
                        className="p-1.5 rounded hover:bg-sky-100/50"
                        title="Salin Nama"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveToTrash([file.id]); }}
                        className="p-1.5 rounded hover:bg-rose-100/50 text-rose-500"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      )}

      {view === 'trash' && currentUser && (
        <main className="max-w-5xl mx-auto px-4 py-6">
          <BackButton />
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trash2 size={22} className="text-rose-500" /> Sampah
          </h2>
          {trashedFiles.length === 0 ? (
            <div className="text-center py-12 opacity-40">
              <Trash2 size={48} className="mx-auto mb-3" />
              <p>Sampah kosong</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trashedFiles.map(file => (
                <div key={file.id} className={`p-4 rounded-xl ${cardClass} opacity-80`}>
                  <div className="flex flex-col items-center text-center gap-2">
                    {getFileIcon(file.type)}
                    <p className="text-sm font-medium truncate w-full">{file.name}</p>
                  </div>
                  <div className="flex justify-center gap-2 mt-3">
                    <button
                      onClick={() => restoreFromTrash(file.id)}
                      className="p-1.5 rounded hover:bg-emerald-100/50 text-emerald-500"
                      title="Pulihkan"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => deleteForever(file.id)}
                      className="p-1.5 rounded hover:bg-rose-100/50 text-rose-500"
                      title="Hapus Permanen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {view === 'settings' && currentUser && (
        <main className="max-w-2xl mx-auto px-4 py-6">
          <BackButton />
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings size={22} /> Pengaturan
          </h2>

          <div className={`p-5 rounded-xl ${cardClass} mb-4`}>
            <h3 className="font-semibold mb-3">Tampilan</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('sky')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border ${
                  theme === 'sky' ? btnPrimary : ''
                }`}
              >
                <Sun size={16} /> Terang
              </button>
              <button
                onClick={() => setTheme('night')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border ${
                  theme === 'night' ? btnPrimary : ''
                }`}
              >
                <Moon size={16} /> Gelap
              </button>
            </div>
          </div>

          <div className={`p-5 rounded-xl ${cardClass} mb-4`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <KeyRound size={16} /> Ganti Sandi
            </h3>
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, ''))}
                placeholder="Sandi baru (6–12 digit angka)"
                maxLength={12}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} outline-none`}
              />
              <input
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value.replace(/\D/g, ''))}
                placeholder="Ulangi sandi baru"
                maxLength={12}
                className={`w-full px-4 py-2.5 rounded-lg border ${inputClass} outline-none`}
              />
              <button
                onClick={handleChangePassword}
                className={`w-full py-2.5 rounded-lg font-medium ${btnPrimary}`}
              >Simpan Sandi Baru</button>
            </div>
          </div>

          <div className={`p-5 rounded-xl ${cardClass} mb-4`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Gift size={16} /> Tukar Kode
            </h3>
            <div className="flex gap-2">
              <input
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                placeholder="Masukkan kode hadiah"
                className={`flex-1 px-4 py-2.5 rounded-lg border ${inputClass} outline-none`}
              />
              <button
                onClick={redeemCode}
                className={`px-4 py-2.5 rounded-lg font-medium ${btnPrimary}`}
              >Tukar</button>
            </div>
          </div>

          <div className={`p-5 rounded-xl ${cardClass}`}>
            <h3 className="font-semibold mb-1">Akun</h3>
            <p className="text-sm opacity-60 mb-3">
              {currentUser.username} · {currentUser.role.toUpperCase()}
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-lg font-medium bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </main>
      )}

      {view === 'admin' && currentUser && currentUser.role.startsWith('admin') && (
        <main className="max-w-4xl mx-auto px-4 py-6">
          <BackButton />
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield size={22} className="text-amber-500" /> Ruang Admin
          </h2>

          <div className={`rounded-xl ${cardClass} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left opacity-60 border-b">
                    <th className="px-4 py-3">Pengguna</th>
                    <th className="px-4 py-3">Peran</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.username} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{u.username}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          u.role.startsWith('admin') ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {u.active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleActive(u)}
                            disabled={u.role === 'admin1'}
                            className="px-2.5 py-1 rounded border text-xs hover:bg-sky-100/50 disabled:opacity-30"
                          >
                            {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          {u.role.startsWith('admin') && u.role !== 'admin1' && (
                            <button
                              onClick={() => revokeAdmin(u)}
                              className="px-2.5 py-1 rounded border text-xs hover:bg-rose-100/50 text-rose-500"
                            >
                              Cabut Admin
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
