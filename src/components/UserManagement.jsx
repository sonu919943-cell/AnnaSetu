import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Users, Shield, Building2, Leaf, Factory, Trash2, Plus, Loader2 } from 'lucide-react';

// Use same config as main app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('business');
  const [newOrgName, setNewOrgName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      // 1. Initialize secondary app so main admin doesn't get logged out
      const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newEmail, newPassword);
      const uid = userCredential.user.uid;

      // 3. Save role & details to Firestore
      await setDoc(doc(db, 'users', uid), {
        email: newEmail,
        role: newRole,
        orgName: newOrgName,
        createdAt: new Date().toISOString()
      });

      // 4. Clean up secondary app
      await secondaryAuth.signOut();
      
      setSuccess(`User ${newEmail} successfully created as ${newRole}!`);
      setNewEmail('');
      setNewPassword('');
      setNewOrgName('');
      
      // Refresh list
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create user.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm("Delete this user's profile? (Note: This only removes Firestore access on the client, true Auth deletion requires Admin SDK)")) return;
    
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(prev => prev.filter(u => u.id !== uid));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user profile.');
    }
  };

  const RoleBadge = ({ role }) => {
    switch(role) {
      case 'super_admin': return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Shield className="w-3 h-3"/> Admin</span>;
      case 'business': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Building2 className="w-3 h-3"/> Kitchen</span>;
      case 'ngo': return <span className="px-2 py-1 bg-saffron-100 text-saffron-700 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Leaf className="w-3 h-3"/> NGO</span>;
      case 'fertilizer': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Factory className="w-3 h-3"/> Bio-Processor</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">Unknown</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-annagreen-600" /> User Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">Add or remove organization accounts and assign powers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create User Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-annagreen-500" /> Create New Account
            </h3>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200">{error}</div>}
            {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-xs rounded-xl border border-emerald-200">{success}</div>}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">Organization Name</label>
                <input 
                  type="text" required value={newOrgName} onChange={e => setNewOrgName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-annagreen-500 focus:ring-1 focus:ring-annagreen-500"
                  placeholder="e.g. Taj Hotel"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-600">Email Address</label>
                <input 
                  type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-annagreen-500 focus:ring-1 focus:ring-annagreen-500"
                  placeholder="admin@taj.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Password</label>
                <input 
                  type="password" required minLength="6" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-annagreen-500 focus:ring-1 focus:ring-annagreen-500"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Assign Role & Powers</label>
                <select 
                  value={newRole} onChange={e => setNewRole(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-annagreen-500 focus:ring-1 focus:ring-annagreen-500"
                >
                  <option value="business">Donor Kitchen (Business)</option>
                  <option value="ngo">Recipient Partner (NGO)</option>
                  <option value="fertilizer">Bio-Processor (Fertilizer)</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <button 
                type="submit" disabled={isCreating}
                className="w-full mt-2 py-2.5 bg-annagreen-600 hover:bg-annagreen-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Account'}
              </button>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-700">Registered Directory</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No user profiles found in Firestore. Create one!</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {users.map(user => (
                  <li key={user.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-800">{user.orgName || 'Unnamed Org'}</h4>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {user.id}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <RoleBadge role={user.role} />
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
