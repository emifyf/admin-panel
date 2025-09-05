// Firebase configuration and utilities
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAQ0FZnhkUS21KeLF2_SD6DvQec4wT2OUU",
  authDomain: "stl-viewer-cac54.firebaseapp.com",
  projectId: "stl-viewer-cac54",
  storageBucket: "stl-viewer-cac54.firebasestorage.app",
  messagingSenderId: "998564690654",
  appId: "1:998564690654:web:e65371fa213ecec699a04f"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export type UserRole = "ADMIN" | "USER" | "TRIAL"

export interface FirebaseUser {
  id?: string
  name: string
  email: string
  role: UserRole
  department: string
  status: "active" | "inactive"
  createdAt?: Date
  updatedAt?: Date
}
// User management functions
export const createUser = async (userData: Omit<FirebaseUser, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const updateUser = async (userId: string, userData: Partial<FirebaseUser>) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId))
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

export const getUsers = async (): Promise<FirebaseUser[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"))
    console.log(querySnapshot)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirebaseUser,
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const getUsersByRole = async (role: UserRole): Promise<FirebaseUser[]> => {
  try {
    const q = query(collection(db, "users"), where("role", "==", role))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirebaseUser,
    )
  } catch (error) {
    console.error("Error fetching users by role:", error)
    throw error
  }
}


/////proyectos
export interface FirebaseProject {
  id?: string
  name: string
  description: string
  owner: string
  path: string
  status: string
  type: string
  created?: Date
  updatedAt?: Date
}

export const createProject = async (projectData: Omit<FirebaseProject, "id" | "created" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      created: new Date(),
      updatedAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export const updateProject = async (projectId: string, projectData: Partial<FirebaseProject>) => {
  try {
    const projectRef = doc(db, "projects", projectId)
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export const deleteProject = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, "projects", projectId))
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

export const getProjects = async (): Promise<FirebaseProject[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"))
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirebaseProject,
    )
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

export const getProjectsByStatus = async (status: string): Promise<FirebaseProject[]> => {
  try {
    const q = query(collection(db, "projects"), where("status", "==", status))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as FirebaseProject,
    )
  } catch (error) {
    console.error("Error fetching projects by status:", error)
    throw error
  }
}