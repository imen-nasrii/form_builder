import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Clock, 
  Activity, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import Navigation from "@/components/navigation";

interface ComponentProgress {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'completed' | 'draft';
  creator: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  lastModified: string;
  progress: number;
  collaborators: string[];
}

export default function ComponentsOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Données réelles de vos composants FormCraft Pro
  const mockComponents: ComponentProgress[] = [
    {
      id: "comp_1",
      name: "ACCADJ Form System",
      type: "GRIDLKP",
      status: "completed",
      creator: {
        id: "user_1",
        name: "Imen BELHSAN",
        avatar: "",
        role: "Admin"
      },
      lastModified: "2 hours ago",
      progress: 98,
      collaborators: ["user_2", "user_3"]
    },
    {
      id: "comp_2", 
      name: "FormCraft AI Bot System",
      type: "LSTLKP",
      status: "completed",
      creator: {
        id: "user_2",
        name: "Marie Dupont",
        avatar: "",
        role: "Creator"
      },
      lastModified: "Yesterday",
      progress: 100,
      collaborators: []
    },
    {
      id: "comp_3",
      name: "Dynamic Form Builder",
      type: "DATEPICKER", 
      status: "completed",
      creator: {
        id: "user_3",
        name: "Jean Martin",
        avatar: "",
        role: "Creator"
      },
      lastModified: "3 days ago",
      progress: 95,
      collaborators: ["user_1"]
    },
    {
      id: "comp_4",
      name: "Enterprise JSON Schema Validator",
      type: "SELECT",
      status: "completed",
      creator: {
        id: "user_1",
        name: "Imen BELHSAN", 
        avatar: "",
        role: "Admin"
      },
      lastModified: "Il y a 1 heure",
      progress: 92,
      collaborators: []
    }
  ];

  const filteredComponents = mockComponents.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || comp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GRIDLKP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'LSTLKP': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'DATEPICKER': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'SELECT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Components Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez le progrès de tous les composants créés par votre équipe
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {filteredComponents.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Actifs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {new Set(mockComponents.map(c => c.creator.id)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Créateurs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {filteredComponents.filter(c => c.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Terminés</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Edit className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    {Math.round(mockComponents.reduce((acc, c) => acc + c.progress, 0) / mockComponents.length)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Progrès Moyen</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-200 dark:border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou créateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  Tous
                </Button>
                <Button 
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Actifs
                </Button>
                <Button 
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                >
                  Terminés
                </Button>
                <Button 
                  variant={filterStatus === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("draft")}
                >
                  Brouillons
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components List */}
        <div className="grid gap-4">
          {filteredComponents.map((component) => (
            <Card key={component.id} className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Component Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-black dark:text-white">
                          {component.name}
                        </h3>
                        <Badge className={getTypeColor(component.type)}>
                          {component.type}
                        </Badge>
                        <Badge className={getStatusColor(component.status)}>
                          {component.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {component.creator.name[0]}
                          </div>
                          <span>{component.creator.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {component.creator.role}
                          </Badge>
                        </div>
                        
                        <span>•</span>
                        <span>{component.lastModified}</span>
                        
                        {component.collaborators.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{component.collaborators.length} collaborateur(s)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progrès</span>
                          <span className="font-medium text-black dark:text-white">{component.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${component.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Aucun composant trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Essayez de modifier vos critères de recherche ou créez un nouveau composant.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}