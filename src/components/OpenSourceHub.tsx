import React, { useState } from 'react';
import { OpenSourceProject, PrivateServer } from '../types';
import { 
  FolderGit2, 
  Star, 
  ExternalLink, 
  Play, 
  Server, 
  Cpu, 
  Terminal, 
  FileCode, 
  Check, 
  Layers, 
  CheckCircle2, 
  Zap,
  Tag
} from 'lucide-react';

interface OpenSourceHubProps {
  projects: OpenSourceProject[];
  servers: PrivateServer[];
  onDeployProject: (project: OpenSourceProject) => void;
  onRunProjectFunction: (injunctionId: string) => void;
}

export const OpenSourceHub: React.FC<OpenSourceHubProps> = ({
  projects,
  servers,
  onDeployProject,
  onRunProjectFunction
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeProject, setActiveProject] = useState<OpenSourceProject>(projects[0]);

  const categories = ["ALL", "AI/LLM", "Networking", "Automation", "Database", "DevOps"];

  const filteredProjects = projects.filter(p => {
    if (selectedCategory === "ALL") return true;
    return p.category === selectedCategory;
  });

  return (
    <div id="opensource-hub-view" className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Open Source Projects & Automations Workspace</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deploy production-grade open source architectures, AI models, and automation microservices into private server subnets.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Projects Cards & Configuration Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Projects Cards List (2 Columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => {
            const isSelected = project.id === activeProject?.id;
            const deployedServer = servers.find(s => s.id === project.deployedServerId);

            return (
              <div
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`bg-slate-900/90 border rounded-2xl p-5 cursor-pointer transition-all shadow-md flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-500 ring-1 ring-cyan-500/50'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-100">{project.name}</h3>
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-500 hover:text-cyan-400 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">by @{project.author}</span>
                    </div>

                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[11px] font-mono">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{(project.starCount / 1000).toFixed(1)}k</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {(project.tags || []).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[9px] bg-slate-950 text-cyan-300 border border-slate-800 rounded font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    {deployedServer ? (
                      <span className="text-emerald-400 font-mono flex items-center space-x-1 text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Deployed to {deployedServer.name}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Not deployed</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeployProject(project);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition-all flex items-center space-x-1"
                  >
                    <Play className="h-3 w-3" />
                    <span>Deploy</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Selected Project Config & Docker Inspector (1 Column) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 min-h-[480px]">
          {activeProject ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <FileCode className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">{activeProject.name}</h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 rounded font-mono">
                  {activeProject.category}
                </span>
              </div>

              {/* YAML Configuration */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>docker-compose.yml Manifest</span>
                  <span className="text-[10px] font-mono text-slate-500">Subnet Target Deployment</span>
                </div>
                <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-emerald-400 h-[220px] overflow-y-auto border border-slate-800 shadow-inner">
                  <pre className="whitespace-pre-wrap leading-relaxed">{activeProject.configYaml}</pre>
                </div>
              </div>

              {/* Bound Parameter Functions */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1">
                  <Zap className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Embedded Parameter Functions</span>
                </h4>
                {(activeProject.parameterFunctions || []).length > 0 ? (
                  <div className="space-y-2">
                    {(activeProject.parameterFunctions || []).map((fn) => (
                      <div key={fn.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-mono text-cyan-300 font-semibold">{fn.name}</div>
                          <div className="text-[10px] text-slate-400">{fn.description}</div>
                        </div>
                        <button
                          onClick={() => onRunProjectFunction(fn.id)}
                          className="px-2.5 py-1 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 text-[11px] font-medium border border-indigo-800"
                        >
                          Execute
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                    No parameter functions attached to this project template.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">
              Select an open source project to inspect deployment parameters
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
