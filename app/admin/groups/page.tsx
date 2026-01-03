'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Users, Image as ImageIcon, X, Pencil } from 'lucide-react'

interface Group {
  id: string
  name: string
  description: string | null
  pp: string | null // base64
  createdAt: string
  _count: {
    members: number
  }
}

export default function AdminGroupsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Group | null>(null)
  
  // Form state
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formImage, setFormImage] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.isAdmin === false) {
      router.push('/')
    }
  }, [session, status, router])

  useEffect(() => {
    fetchGroups()
  }, [])

  async function fetchGroups() {
    try {
      const res = await fetch('/api/groups')
      if (res.ok) {
        setGroups(await res.json())
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Limite 2MB
    if (file.size > 2 * 1024 * 1024) {
      setFormError('L\'image ne doit pas dépasser 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      setFormImage(base64)
      setFormError('')
    }
    reader.readAsDataURL(file)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (!formName.trim()) {
      setFormError('Le nom est requis')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null,
          pp: formImage,
        }),
      })

      if (res.ok) {
        const newGroup = await res.json()
        setGroups([newGroup, ...groups])
        resetForm()
        setShowCreateModal(false)
      } else {
        const data = await res.json()
        setFormError(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating group:', error)
      setFormError('Erreur lors de la création')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(group: Group) {
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setGroups(groups.filter(g => g.id !== group.id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Error deleting group:', error)
    }
  }

  function openEditModal(group: Group) {
    setFormName(group.name)
    setFormDescription(group.description || '')
    setFormImage(group.pp)
    setEditingGroup(group)
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingGroup) return
    setFormError('')

    if (!formName.trim()) {
      setFormError('Le nom est requis')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/groups/${editingGroup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null,
          pp: formImage,
        }),
      })

      if (res.ok) {
        const updatedGroup = await res.json()
        setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g))
        resetForm()
        setEditingGroup(null)
      } else {
        const data = await res.json()
        setFormError(data.error || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Error updating group:', error)
      setFormError('Erreur lors de la modification')
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setFormName('')
    setFormDescription('')
    setFormImage(null)
    setFormError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
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
    <main className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="btn btn-ghost btn-circle">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Gestion des groupes</h1>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" /> Nouveau groupe
        </button>
      </div>

      {/* Grille des groupes */}
      {groups.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <Users className="w-16 h-16 opacity-30 mb-4" />
            <h2 className="text-xl font-semibold">Aucun groupe</h2>
            <p className="opacity-70">Créez votre premier groupe pour commencer</p>
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="btn btn-primary mt-4"
            >
              <Plus className="w-4 h-4" /> Créer un groupe
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(group => (
            <div key={group.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  {/* Avatar du groupe */}
                  {group.pp ? (
                    <div className="avatar">
                      <div className="w-14 rounded-xl">
                        <img 
                          src={`data:image/png;base64,${group.pp}`} 
                          alt={group.name}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h2 className="card-title text-lg truncate">{group.name}</h2>
                    {group.description && (
                      <p className="text-sm opacity-70 line-clamp-2">{group.description}</p>
                    )}
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm opacity-70">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {group._count.members} membre{group._count.members > 1 ? 's' : ''}
                    </span>
                    <span>Créé le {formatDate(group.createdAt)}</span>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => openEditModal(group)}
                      className="btn btn-ghost btn-sm hover:bg-primary/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(group)}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal création */}
      {showCreateModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Créer un groupe</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Nom */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom du groupe *</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="input input-bordered"
                  placeholder="Ex: Famille, Amis proches..."
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="textarea textarea-bordered"
                  placeholder="Description optionnelle du groupe"
                  rows={3}
                />
              </div>

              {/* Image */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo du groupe (optionnel)</span>
                </label>
                <div className="flex items-center gap-4">
                  {formImage ? (
                    <div className="relative">
                      <img 
                        src={`data:image/png;base64,${formImage}`}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormImage(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="btn btn-circle btn-xs absolute -top-2 -right-2 btn-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-base-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <ImageIcon className="w-6 h-6 opacity-50" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline btn-sm"
                  >
                    Choisir une image
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt opacity-50">Max 2MB, formats: JPG, PNG, GIF</span>
                </label>
              </div>

              {/* Erreur */}
              {formError && (
                <div className="alert alert-error">
                  <span>{formError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="modal-action">
                <button 
                  type="button" 
                  onClick={() => { setShowCreateModal(false); resetForm() }}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting && <span className="loading loading-spinner loading-sm"></span>}
                  Créer le groupe
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => { setShowCreateModal(false); resetForm() }}>close</button>
          </form>
        </dialog>
      )}

      {/* Modal édition */}
      {editingGroup && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Modifier le groupe</h3>
            
            <form onSubmit={handleEdit} className="space-y-4">
              {/* Nom */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom du groupe *</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="input input-bordered"
                  placeholder="Ex: Famille, Amis proches..."
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="textarea textarea-bordered"
                  placeholder="Description optionnelle du groupe"
                  rows={3}
                />
              </div>

              {/* Image */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo du groupe</span>
                </label>
                <div className="flex items-center gap-4">
                  {formImage ? (
                    <div className="relative">
                      <img 
                        src={`data:image/png;base64,${formImage}`}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormImage(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="btn btn-circle btn-xs absolute -top-2 -right-2 btn-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-base-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <ImageIcon className="w-6 h-6 opacity-50" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline btn-sm"
                  >
                    Choisir une image
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt opacity-50">Max 2MB, formats: JPG, PNG, GIF</span>
                </label>
              </div>

              {/* Erreur */}
              {formError && (
                <div className="alert alert-error">
                  <span>{formError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="modal-action">
                <button 
                  type="button" 
                  onClick={() => { setEditingGroup(null); resetForm() }}
                  className="btn btn-ghost"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting && <span className="loading loading-spinner loading-sm"></span>}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => { setEditingGroup(null); resetForm() }}>close</button>
          </form>
        </dialog>
      )}

      {/* Modal confirmation suppression */}
      {deleteConfirm && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Supprimer le groupe</h3>
            <p className="py-4">
              Êtes-vous sûr de vouloir supprimer le groupe <strong>{deleteConfirm.name}</strong> ?
              <br />
              <span className="text-sm opacity-70">
                Les {deleteConfirm._count.members} membre(s) seront retirés du groupe.
              </span>
            </p>
            <div className="modal-action">
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost">
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm)} 
                className="btn btn-error"
              >
                Supprimer
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setDeleteConfirm(null)}>close</button>
          </form>
        </dialog>
      )}
    </main>
  )
}
