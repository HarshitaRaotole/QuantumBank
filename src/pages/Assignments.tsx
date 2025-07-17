"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { api } from "../services/api"
import { Plus, Calendar, Clock, CheckCircle, AlertCircle, Edit, Trash2, Filter } from "lucide-react"
import toast from "react-hot-toast"

interface Assignment {
  id: number
  title: string
  description: string
  due_date: string
  status: "pending" | "in_progress" | "submitted"
  subject_id: number
  subject_name: string
  subject_color: string
}

interface Subject {
  id: number
  name: string
  color: string
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterSubject, setFilterSubject] = useState<string>("all")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    subject_id: "",
    status: "pending" as "pending" | "in_progress" | "submitted",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [assignmentsRes, subjectsRes] = await Promise.all([api.get("/assignments"), api.get("/subjects")])

      setAssignments(assignmentsRes.data)
      setSubjects(subjectsRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingAssignment) {
        await api.put(`/assignments/${editingAssignment.id}`, formData)
        toast.success("Assignment updated successfully!")
      } else {
        await api.post("/assignments", formData)
        toast.success("Assignment created successfully!")
      }

      fetchData()
      resetForm()
    } catch (error) {
      console.error("Error saving assignment:", error)
    }
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date.split("T")[0],
      subject_id: assignment.subject_id.toString(),
      status: assignment.status,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await api.delete(`/assignments/${id}`)
        toast.success("Assignment deleted successfully!")
        fetchData()
      } catch (error) {
        console.error("Error deleting assignment:", error)
      }
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.put(`/assignments/${id}`, { status })
      toast.success("Status updated successfully!")
      fetchData()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      due_date: "",
      subject_id: "",
      status: "pending",
    })
    setEditingAssignment(null)
    setShowModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "submitted":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />
      case "submitted":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (dueDate: string, status: string) => {
    return status !== "submitted" && new Date(dueDate) < new Date()
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const statusMatch = filterStatus === "all" || assignment.status === filterStatus
    const subjectMatch = filterSubject === "all" || assignment.subject_id.toString() === filterSubject
    return statusMatch && subjectMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-2">Manage your assignments and track deadlines.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow">
        {filteredAssignments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: assignment.subject_color }}></div>
                      <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                      {isOverdue(assignment.due_date, assignment.status) && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{assignment.description}</p>
                    <div className="flex items-center mt-3 space-x-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {formatDate(assignment.due_date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">Subject: {assignment.subject_name}</div>
                      <div className="flex items-center">
                        <select
                          value={assignment.status}
                          onChange={(e) => handleStatusChange(assignment.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(assignment.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="submitted">Submitted</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(assignment)} className="p-2 text-gray-400 hover:text-blue-600">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">Get started by creating your first assignment.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  required
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {editingAssignment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
