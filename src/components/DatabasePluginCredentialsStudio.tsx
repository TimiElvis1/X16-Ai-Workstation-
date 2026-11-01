import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Key,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Layers,
  Send,
  Trash2,
  Table,
  Sliders
} from 'lucide-react';

export const DatabasePluginCredentialsStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'forms' | 'submissions'>('credentials');

  // Credentials State
  const [credentialsList, setCredentialsList] = useState<any[]>([]);
  const [isLoadingCreds, setIsLoadingCreds] = useState<boolean>(true);
  const [showAddCredModal, setShowAddCredModal] = useState<boolean>(false);
  const [newCredForm, setNewCredForm] = useState({
    name: '',
    dbType: 'PostgreSQL',
    host: '',
    port: '5432',
    username: '',
    password: '',
    databaseName: '',
    sslMode: 'require'
  });
  const [testingHost, setTestingHost] = useState<string | null>(null);
  const [testingResult, setTestingResult] = useState<any | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<{ [id: string]: boolean }>({});

  // Forms State
  const [formsList, setFormsList] = useState<any[]>([]);
  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState<boolean>(true);
  const [showCreateFormModal, setShowCreateFormModal] = useState<boolean>(false);
  const [newFormTitle, setNewFormTitle] = useState<string>('');
  const [newFormDesc, setNewFormDesc] = useState<string>('');
  const [newFormTableName, setNewFormTableName] = useState<string>('');
  const [formFields, setFormFields] = useState<Array<{ name: string; label: string; type: string; required: boolean }>>([
    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
    { name: 'user_email', label: 'User Email Address', type: 'email', required: true }
  ]);

  // Form Submission Testing State
  const [selectedFormForTest, setSelectedFormForTest] = useState<any | null>(null);
  const [formTestData, setFormTestData] = useState<{ [key: string]: string }>({});
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Fetch Credentials and Forms on mount
  useEffect(() => {
    fetchCredentials();
    fetchForms();
  }, []);

  const fetchCredentials = async () => {
    setIsLoadingCreds(true);
    try {
      const res = await fetch('/api/db-plugin/credentials');
      const data = await res.json();
      if (data.success) {
        setCredentialsList(data.credentials || []);
      }
    } catch (err) {
      console.error('Error fetching db credentials:', err);
    } finally {
      setIsLoadingCreds(false);
    }
  };

  const fetchForms = async () => {
    setIsLoadingForms(true);
    try {
      const res = await fetch('/api/db-plugin/forms');
      const data = await res.json();
      if (data.success) {
        setFormsList(data.forms || []);
        setSubmissionsList(data.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching db forms:', err);
    } finally {
      setIsLoadingForms(false);
    }
  };

  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/db-plugin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCredForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddCredModal(false);
        setNewCredForm({
          name: '',
          dbType: 'PostgreSQL',
          host: '',
          port: '5432',
          username: '',
          password: '',
          databaseName: '',
          sslMode: 'require'
        });
        fetchCredentials();
      }
    } catch (err) {
      console.error('Add credential error:', err);
    }
  };

  const handleTestConnection = async (host: string, port: number, dbType: string) => {
    setTestingHost(host);
    setTestingResult(null);
    try {
      const res = await fetch('/api/db-plugin/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port, dbType })
      });
      const data = await res.json();
      setTestingResult(data);
    } catch (err) {
      setTestingResult({ success: false, message: 'Connection timeout' });
    } finally {
      setTestingHost(null);
    }
  };

  const handleAddField = () => {
    setFormFields([...formFields, { name: '', label: '', type: 'text', required: false }]);
  };

  const handleRemoveField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim() || formFields.length === 0) return;
    try {
      const res = await fetch('/api/db-plugin/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newFormTitle,
          description: newFormDesc,
          tableName: newFormTableName || newFormTitle.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          fields: formFields
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateFormModal(false);
        setNewFormTitle('');
        setNewFormDesc('');
        setNewFormTableName('');
        fetchForms();
      }
    } catch (err) {
      console.error('Create form error:', err);
    }
  };

  const handleSubmitTestData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFormForTest) return;
    setIsSubmittingForm(true);
    setSubmissionFeedback(null);
    try {
      const res = await fetch('/api/db-plugin/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: selectedFormForTest.id,
          data: formTestData
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmissionFeedback('Submitted & saved to Database plugin successfully!');
        setFormTestData({});
        fetchForms();
      }
    } catch (err) {
      setSubmissionFeedback('Submission failed. Check network status.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-blue-500/20 border border-emerald-500/30 text-emerald-400 shadow-lg">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Database Plugin &amp; Credentials Vault
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase cyber-neon-box">
                Active Plugin Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Secure Credentials Connector, Connection String Encryption &amp; Dynamic Database Form Schema Builder
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'credentials'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Key className="h-3.5 w-3.5 text-emerald-500" />
            <span>DB Credentials Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('forms')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'forms'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-cyan-500" />
            <span>Form Builder Plugins</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'submissions'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Table className="h-3.5 w-3.5 text-amber-500" />
            <span>Form Data Submissions</span>
          </button>
        </div>
      </div>

      {/* 1. CREDENTIALS VAULT TAB */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-400">
              Registered Database Plugins ({credentialsList.length} Active Connections)
            </div>
            <button
              onClick={() => setShowAddCredModal(true)}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs transition-all flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Add DB Plugin Credential</span>
            </button>
          </div>

          {/* Test connection feedback notification */}
          {testingResult && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              testingResult.success
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{testingResult.message} ({testingResult.latencyMs}ms latency)</span>
              </div>
              <span className="text-[10px] font-bold uppercase">{testingResult.dbEngineVersion}</span>
            </div>
          )}

          {/* Credentials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentialsList.map((cred) => (
              <div
                key={cred.id}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 rounded-xl p-4 space-y-3 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-black border border-zinc-800 text-emerald-400">
                      <Server className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cred.name}</h4>
                      <span className="text-[10px] text-zinc-400">{cred.dbType} Engine &bull; Port {cred.port}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{cred.status}</span>
                  </span>
                </div>

                <div className="bg-black/80 rounded-lg p-3 text-xs space-y-1.5 border border-zinc-800">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Host / Endpoint:</span>
                    <span className="text-white font-mono">{cred.host}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Database / Username:</span>
                    <span className="text-emerald-300 font-mono">{cred.databaseName} ({cred.username})</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Encrypted Key:</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-zinc-500 font-mono">
                        {visibleKeys[cred.id] ? cred.encryptedSecretKey : '••••••••••••••••'}
                      </span>
                      <button
                        onClick={() => setVisibleKeys(prev => ({ ...prev, [cred.id]: !prev[cred.id] }))}
                        className="text-zinc-400 hover:text-white"
                      >
                        {visibleKeys[cred.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-zinc-500">SSL: {cred.sslMode}</span>
                  <button
                    onClick={() => handleTestConnection(cred.host, cred.port, cred.dbType)}
                    disabled={testingHost === cred.host}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    {testingHost === cred.host ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                    ) : (
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                    <span>Test Connector</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for adding database credential */}
          {showAddCredModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 font-mono shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Key className="h-4 w-4 text-emerald-400" />
                    <span>Register New Database Plugin</span>
                  </h3>
                  <button onClick={() => setShowAddCredModal(false)} className="text-zinc-500 hover:text-white text-xs font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddCredential} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300">Plugin Connection Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SubNet Vector DB Primary Node"
                      value={newCredForm.name}
                      onChange={e => setNewCredForm({ ...newCredForm, name: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-zinc-300">Database Engine</label>
                      <select
                        value={newCredForm.dbType}
                        onChange={e => setNewCredForm({ ...newCredForm, dbType: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                      >
                        <option value="PostgreSQL">PostgreSQL</option>
                        <option value="MongoDB">MongoDB</option>
                        <option value="MySQL">MySQL</option>
                        <option value="Redis">Redis</option>
                        <option value="SubNet-Vector">SubNet Vector DB</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-zinc-300">Port</label>
                      <input
                        type="text"
                        required
                        value={newCredForm.port}
                        onChange={e => setNewCredForm({ ...newCredForm, port: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300">Host / Domain</label>
                    <input
                      type="text"
                      required
                      placeholder="db.subnet-cluster.internal"
                      value={newCredForm.host}
                      onChange={e => setNewCredForm({ ...newCredForm, host: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-zinc-300">Username</label>
                      <input
                        type="text"
                        placeholder="subnet_admin"
                        value={newCredForm.username}
                        onChange={e => setNewCredForm({ ...newCredForm, username: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-zinc-300">Database Name</label>
                      <input
                        type="text"
                        placeholder="subnet_vault"
                        value={newCredForm.databaseName}
                        onChange={e => setNewCredForm({ ...newCredForm, databaseName: e.target.value })}
                        className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCredModal(false)}
                      className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold"
                    >
                      Save DB Plugin Credential
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. FORMS BUILDER TAB */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-400">
              Custom Database Form Schemas ({formsList.length} Active Forms)
            </div>
            <button
              onClick={() => setShowCreateFormModal(true)}
              className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs transition-all flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Create Dynamic Database Form</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forms Schema List */}
            <div className="lg:col-span-1 space-y-3">
              {formsList.map((form) => (
                <div
                  key={form.id}
                  onClick={() => setSelectedFormForTest(form)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedFormForTest?.id === form.id
                      ? 'bg-zinc-900 border-cyan-500 shadow-lg'
                      : 'bg-black/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white">{form.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      {form.submissionsCount} Entries
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">{form.description}</p>
                  <div className="mt-2 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
                    <span>Table: {form.tableName}</span>
                    <span>{form.fields.length} Fields</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Testing & Live Preview Panel */}
            <div className="lg:col-span-2 bg-black border border-zinc-800 rounded-xl p-5 space-y-4">
              {selectedFormForTest ? (
                <div className="space-y-4">
                  <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedFormForTest.title}</h3>
                      <p className="text-xs text-zinc-400">{selectedFormForTest.description}</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Mapped Table: {selectedFormForTest.tableName}
                    </span>
                  </div>

                  {submissionFeedback && (
                    <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{submissionFeedback}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitTestData} className="space-y-4 text-xs">
                    {(selectedFormForTest?.fields || []).map((f: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <label className="font-bold text-zinc-300 flex items-center space-x-1">
                          <span>{f.label}</span>
                          {f.required && <span className="text-rose-400">*</span>}
                        </label>
                        {f.type === 'select' ? (
                          <select
                            value={formTestData[f.name] || ''}
                            onChange={e => setFormTestData({ ...formTestData, [f.name]: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value="">Select option...</option>
                            {f.options?.map((opt: string, i: number) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : f.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            value={formTestData[f.name] || ''}
                            onChange={e => setFormTestData({ ...formTestData, [f.name]: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                            placeholder={`Enter ${f.label.toLowerCase()}...`}
                          />
                        ) : (
                          <input
                            type={f.type || 'text'}
                            value={formTestData[f.name] || ''}
                            onChange={e => setFormTestData({ ...formTestData, [f.name]: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                            placeholder={`Enter ${f.label.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-black text-xs transition-all flex items-center justify-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Form Record to DB Plugin</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-20 text-center text-zinc-600 text-xs">
                  Select a form schema from the left list to test dynamic submission.
                </div>
              )}
            </div>
          </div>

          {/* Modal for creating a new form schema */}
          {showCreateFormModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 font-mono shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-cyan-400" />
                    <span>Create Database Form Schema</span>
                  </h3>
                  <button onClick={() => setShowCreateFormModal(false)} className="text-zinc-500 hover:text-white text-xs font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateForm} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300">Form Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SubNet Node Registration Form"
                      value={newFormTitle}
                      onChange={e => setNewFormTitle(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300">Description</label>
                    <input
                      type="text"
                      placeholder="Purpose of form data..."
                      value={newFormDesc}
                      onChange={e => setNewFormDesc(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-zinc-300">Form Fields Schema</label>
                      <button
                        type="button"
                        onClick={handleAddField}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Field</span>
                      </button>
                    </div>

                    {formFields.map((field, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-black p-2 rounded-lg border border-zinc-800">
                        <input
                          type="text"
                          placeholder="Field Name"
                          value={field.name}
                          onChange={e => {
                            const updated = [...formFields];
                            updated[idx].name = e.target.value;
                            setFormFields(updated);
                          }}
                          className="w-1/3 bg-zinc-950 border border-zinc-800 rounded p-1.5 text-white text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Field Label"
                          value={field.label}
                          onChange={e => {
                            const updated = [...formFields];
                            updated[idx].label = e.target.value;
                            setFormFields(updated);
                          }}
                          className="w-1/3 bg-zinc-950 border border-zinc-800 rounded p-1.5 text-white text-[11px]"
                        />
                        <select
                          value={field.type}
                          onChange={e => {
                            const updated = [...formFields];
                            updated[idx].type = e.target.value;
                            setFormFields(updated);
                          }}
                          className="w-1/4 bg-zinc-950 border border-zinc-800 rounded p-1.5 text-white text-[11px]"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="textarea">Textarea</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateFormModal(false)}
                      className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold"
                    >
                      Save Form Schema
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SUBMISSIONS TABLE TAB */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Recorded Database Form Entries ({submissionsList.length} Records)
          </div>

          <div className="overflow-x-auto bg-black border border-zinc-800 rounded-xl">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-3">Record ID</th>
                  <th className="p-3">Form Schema ID</th>
                  <th className="p-3">Data Payload</th>
                  <th className="p-3">Submitted At</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {submissionsList.map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-900/50">
                    <td className="p-3 text-emerald-400 font-bold">{sub.id}</td>
                    <td className="p-3 text-cyan-300">{sub.formId}</td>
                    <td className="p-3">
                      <pre className="text-[10px] text-zinc-300 bg-zinc-950 p-1.5 rounded max-w-xs overflow-x-auto">
                        {JSON.stringify(sub.data, null, 1)}
                      </pre>
                    </td>
                    <td className="p-3 text-zinc-400">{new Date(sub.submittedAt).toLocaleString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
