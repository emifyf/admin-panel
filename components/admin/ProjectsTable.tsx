"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Search, Eye } from "lucide-react"
import type { ACL } from "@/lib/acl"
import type { User, Project } from "./UsersTable"

interface ProjectsTableProps {
  projects: Project[]
  users: User[]
  acl: ACL
}

export function ProjectsTable({ projects, users, acl }: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getProjectViewers = (projectId: string): User[] => {
    const viewerIds: string[] = []

    // Find all users who have access to this project
    Object.entries(acl).forEach(([userId, projectIds]) => {
      if (projectIds.includes(projectId)) {
        viewerIds.push(userId)
      }
    })

    return users.filter((user) => viewerIds.includes(user.id))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "planning":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects by name, description, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No projects found matching your search." : "No projects available."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell>{formatDate(project.created)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedProject?.name}</SheetTitle>
            <SheetDescription>Project details and viewer access</SheetDescription>
          </SheetHeader>

          {selectedProject && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium">Project Information</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Description:</strong> {selectedProject.description}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedProject.status}
                  </p>
                  <p>
                    <strong>Owner:</strong> {selectedProject.owner}
                  </p>
                  <p>
                    <strong>Created:</strong> {formatDate(selectedProject.created)}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedProject.id}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Viewers ({getProjectViewers(selectedProject.id).length})</h4>
                <div className="space-y-2">
                  {getProjectViewers(selectedProject.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users have access to this project</p>
                  ) : (
                    getProjectViewers(selectedProject.id).map((user) => (
                      <div key={user.id} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="mr-3">{user.email}</span>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
