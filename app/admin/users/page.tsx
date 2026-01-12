'use client'

import Main from '@/components/Main'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, X, Plus, UserCircle } from 'lucide-react'

interface Group {
  id: string
  name: string
}

interface User {
  id: string
  mail: string
  firstname: string
  lastname: string
  avatarPath: string | null
  firstLogin: string | null
  lastLogin: string | null
  groups: Group[]
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ firstname: '', lastname: '' })
  const [groupModalUser, setGroupModalUser] = useState<User | null>(null)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.isAdmin === false) {
      router.push('/')
    }
  }, [session, status, router])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [usersRes, groupsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/groups'),
      ])
      
      if (usersRes.ok) {
        setUsers(await usersRes.json())
      }
      if (groupsRes.ok) {
        setGroups(await groupsRes.json())
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(user: User) {
    setEditingUser(user.id)
    setEditForm({ firstname: user.firstname, lastname: user.lastname })
  }

  async function saveEdit(userId: string) {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        const updated = await res.json()
        setUsers(users.map(u => u.id === userId ? updated : u))
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  function openGroupModal(user: User) {
    setGroupModalUser(user)
    setSelectedGroups(user.groups.map(g => g.id))
  }

  function toggleGroup(groupId: string) {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  async function saveGroups() {
    if (!groupModalUser) return

    try {
      const res = await fetch(`/api/users/${groupModalUser.id}/groups`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupIds: selectedGroups }),
      })

      if (res.ok) {
        const updated = await res.json()
        setUsers(users.map(u => u.id === groupModalUser.id ? updated : u))
        setGroupModalUser(null)
      }
    } catch (error) {
      console.error('Error updating groups:', error)
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (status === 'loading' || loading) {
    return (
      <main className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </main>
    )
  }

  return (
    <Main>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="btn btn-ghost btn-circle">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        </div>
        <div className="badge badge-primary badge-lg">{users.length} utilisateurs</div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Première connexion</th>
              <th>Dernière connexion</th>
              <th>Groupes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  {editingUser === user.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.firstname}
                        onChange={e => setEditForm({ ...editForm, firstname: e.target.value })}
                        className="input input-bordered input-sm w-24"
                        placeholder="Prénom"
                      />
                      <input
                        type="text"
                        value={editForm.lastname}
                        onChange={e => setEditForm({ ...editForm, lastname: e.target.value })}
                        className="input input-bordered input-sm w-24"
                        placeholder="Nom"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          {user.avatarPath ? (
                            <img
                              src={`/api/users/${user.id}/avatar`}
                              alt={`${user.firstname} ${user.lastname}`}
                              onError={e => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = document.createElement('div');
                                fallback.className = 'w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center';
                                fallback.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' class='lucide lucide-user-circle w-6 h-6 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke-width='2'/><circle cx='12' cy='10' r='3' stroke-width='2'/><path d='M6 18c0-2.21 3.582-4 6-4s6 1.79 6 4' stroke-width='2'/></svg>`;
                                target.parentElement?.appendChild(fallback);
                              }}
                            />
                          ) : (
                            <UserCircle className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {user.firstname || user.lastname 
                            ? `${user.firstname} ${user.lastname}`.trim()
                            : <span className="opacity-50">Non renseigné</span>
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="text-sm opacity-70">{user.mail}</td>
                <td className="text-sm">{formatDate(user.firstLogin)}</td>
                <td className="text-sm">{formatDate(user.lastLogin)}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {user.groups.length > 0 ? (
                      user.groups.map(g => (
                        <span key={g.id} className="badge badge-outline badge-sm">{g.name}</span>
                      ))
                    ) : (
                      <span className="text-sm opacity-50">Aucun</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    {editingUser === user.id ? (
                      <>
                        <button 
                          onClick={() => saveEdit(user.id)} 
                          className="btn btn-success btn-xs"
                        >
                          <Save className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setEditingUser(null)} 
                          className="btn btn-ghost btn-xs"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(user)} 
                          className="btn btn-ghost btn-xs"
                        >
                          Éditer
                        </button>
                        <button 
                          onClick={() => openGroupModal(user)} 
                          className="btn btn-primary btn-xs"
                        >
                          <Plus className="w-3 h-3" /> Groupes
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal gestion des groupes */}
      {groupModalUser && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Groupes de {groupModalUser.firstname || groupModalUser.mail}
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {groups.length === 0 ? (
                <p className="text-center opacity-50 py-4">
                  Aucun groupe disponible. Créez-en d&apos;abord dans la section Groupes.
                </p>
              ) : (
                groups.map(group => (
                  <label 
                    key={group.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGroups.includes(group.id) 
                        ? 'bg-primary/20 border-2 border-primary' 
                        : 'bg-base-200 hover:bg-base-300 border-2 border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroup(group.id)}
                      className="checkbox checkbox-primary"
                    />
                    <span className="font-medium">{group.name}</span>
                  </label>
                ))
              )}
            </div>

            <div className="modal-action">
              <button onClick={() => setGroupModalUser(null)} className="btn btn-ghost">
                Annuler
              </button>
              <button onClick={saveGroups} className="btn btn-primary">
                Enregistrer
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setGroupModalUser(null)}>close</button>
          </form>
        </dialog>
      )}
    </Main>
  )
}
