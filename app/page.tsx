'use client'

import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, CheckCircle2, Circle, Trophy, TrendingUp, Calendar, Flame } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  category: string
  progress: number
  targetDate: string
  milestones: Milestone[]
  createdAt: string
  completed: boolean
}

interface Milestone {
  id: string
  title: string
  completed: boolean
}

const categories = [
  { name: 'Health', color: 'bg-green-500', lightColor: 'bg-green-100', textColor: 'text-green-700' },
  { name: 'Career', color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { name: 'Finance', color: 'bg-yellow-500', lightColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { name: 'Personal', color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-700' },
  { name: 'Education', color: 'bg-pink-500', lightColor: 'bg-pink-100', textColor: 'text-pink-700' },
  { name: 'Relationships', color: 'bg-red-500', lightColor: 'bg-red-100', textColor: 'text-red-700' },
]

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Personal',
    targetDate: '',
    milestones: ['']
  })
  const [filter, setFilter] = useState('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('goals')
    if (saved) {
      setGoals(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (!newGoal.title.trim()) return
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      progress: 0,
      targetDate: newGoal.targetDate,
      milestones: newGoal.milestones
        .filter(m => m.trim())
        .map((m, i) => ({ id: `${Date.now()}-${i}`, title: m, completed: false })),
      createdAt: new Date().toISOString(),
      completed: false
    }
    
    setGoals([...goals, goal])
    setNewGoal({ title: '', description: '', category: 'Personal', targetDate: '', milestones: [''] })
    setShowAddModal(false)
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
    setSelectedGoal(null)
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        )
        const completedCount = updatedMilestones.filter(m => m.completed).length
        const progress = updatedMilestones.length > 0 
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : goal.progress
        return { 
          ...goal, 
          milestones: updatedMilestones, 
          progress,
          completed: progress === 100
        }
      }
      return goal
    }))
  }

  const updateProgress = (goalId: string, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress, completed: progress === 100 }
        : goal
    ))
  }

  const getCategoryStyle = (categoryName: string) => {
    return categories.find(c => c.name === categoryName) || categories[3]
  }

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true
    if (filter === 'completed') return goal.completed
    if (filter === 'active') return !goal.completed
    return goal.category === filter
  })

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.completed).length,
    inProgress: goals.filter(g => !g.completed && g.progress > 0).length,
    streak: Math.floor(Math.random() * 7) + 1 // Placeholder streak
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Goal Tracker</h1>
              <p className="text-gray-500">Achieve your dreams, one step at a time</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Goals</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.streak}</p>
                <p className="text-sm text-gray-500">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'active', 'completed', ...categories.map(c => c.name)].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No goals yet</h3>
            <p className="text-gray-400 mb-6">Start by adding your first goal!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Add Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map(goal => {
              const categoryStyle = getCategoryStyle(goal.category)
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 ${
                    goal.completed ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryStyle.lightColor} ${categoryStyle.textColor}`}>
                      {goal.category}
                    </span>
                    {goal.completed && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{goal.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-700">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          goal.completed ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  {goal.targetDate && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Due {new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Goal</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title *</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="What do you want to achieve?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal in detail..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setNewGoal({ ...newGoal, category: cat.name })}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          newGoal.category === cat.name
                            ? `${cat.color} text-white`
                            : `${cat.lightColor} ${cat.textColor} hover:opacity-80`
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Milestones</label>
                  {newGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={e => {
                          const updated = [...newGoal.milestones]
                          updated[index] = e.target.value
                          setNewGoal({ ...newGoal, milestones: updated })
                        }}
                        placeholder={`Milestone ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      {newGoal.milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = newGoal.milestones.filter((_, i) => i !== index)
                            setNewGoal({ ...newGoal, milestones: updated })
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewGoal({ ...newGoal, milestones: [...newGoal.milestones, ''] })}
                    className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                  >
                    + Add Milestone
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goal Detail Modal */}
        {selectedGoal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(selectedGoal.category).lightColor} ${getCategoryStyle(selectedGoal.category).textColor}`}>
                    {selectedGoal.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800 mt-2">{selectedGoal.title}</h2>
                </div>
                {selectedGoal.completed && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>

              {selectedGoal.description && (
                <p className="text-gray-600 mb-6">{selectedGoal.description}</p>
              )}

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-medium text-gray-700">{selectedGoal.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedGoal.completed ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${selectedGoal.progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedGoal.progress}
                  onChange={e => {
                    const newProgress = parseInt(e.target.value)
                    updateProgress(selectedGoal.id, newProgress)
                    setSelectedGoal({ ...selectedGoal, progress: newProgress, completed: newProgress === 100 })
                  }}
                  className="w-full mt-2 accent-indigo-600"
                />
              </div>

              {selectedGoal.milestones.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Milestones</h3>
                  <div className="space-y-2">
                    {selectedGoal.milestones.map(milestone => (
                      <button
                        key={milestone.id}
                        onClick={() => {
                          toggleMilestone(selectedGoal.id, milestone.id)
                          const updated = selectedGoal.milestones.map(m =>
                            m.id === milestone.id ? { ...m, completed: !m.completed } : m
                          )
                          const completedCount = updated.filter(m => m.completed).length
                          const progress = Math.round((completedCount / updated.length) * 100)
                          setSelectedGoal({ ...selectedGoal, milestones: updated, progress, completed: progress === 100 })
                        }}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                      >
                        {milestone.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={milestone.completed ? 'text-gray-400 line-through' : 'text-gray-700'}>
                          {milestone.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedGoal.targetDate && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>Target: {new Date(selectedGoal.targetDate).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => deleteGoal(selectedGoal.id)}
                  className="px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
