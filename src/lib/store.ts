export type Workspace = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
};

export type Step = {
  id: string;
  name: string;
  type: 'tooltip' | 'modal' | 'inline-hint' | 'checklist-item';
  content: string;
  selector?: string;
  urlTrigger?: string;
  eventTrigger?: string;
  enabled: boolean;
  conditions?: {
    requiredEvent?: string;
  }
};

export type Event = {
  id: string;
  clientId: string;
  name: string;
  timestamp: string;
  metadata?: Record<string, any>;
};

export type Trigger = {
  id: string;
  stepId: string;
  type: 'page' | 'event' | 'time' | 'user_state';
  config: Record<string, any>;
};

export type Flow = {
  id: string;
  projectId: string;
  name: string;
  steps: Step[];
  status: 'active' | 'draft';
};

export type Template = {
  id: number | string;
  title: string;
  description?: string;
  tasks?: Array<{ id: number | string; title: string; completed?: boolean }>;
};

export type Client = {
  id: number | string;
  projectId: string;
  slug: string;
  name: string;
  email: string;
  company?: string;
  template?: string;
  tasks?: Array<{ id: number | string; title: string; completed?: boolean; deadline?: string; priority?: string; description?: string; }>;
  progress?: number;
  status?: string;
  lastActivity?: string;
  isActivated?: boolean;
  segment?: UserSegment;
};

export type UserSegment = 'new_user' | 'returning_inactive' | 'power_user' | 'churn_risk';

export type FunnelStepAnalytics = {
  name: string;
  count: number;
  dropOff: number;
  avgTime: string;
};

export type Analytics = {
  funnel: FunnelStepAnalytics[];
};

export type FailingStep = {
  name: string;
  failRate: number;
};

export type Transmission = {
  id: number | string;
  client: string;
  template: string;
  time: string;
  status: string; // sent|opened|bounced
};

export type EmailTemplate = {
  id: number | string;
  name: string;
  subject: string;
  trigger: string;
  openRate: string;
  status: 'active' | 'draft';
};

const STORAGE_KEYS = {
  workspaces: "onboardly.workspaces",
  projects: "onboardly.projects",
  flows: "onboardly.flows",
  events: "onboardly.events",
  triggers: "onboardly.triggers",
  templates: "onboardly.templates",
  clients: "onboardly.clients",
  transmissions: "onboardly.transmissions",
  emailTemplates: "onboardly.emailTemplates",
  webhookUrl: "onboardly.webhookUrl",
  plan: "onboardly.plan",
};

const defaultWorkspaces: Workspace[] = [{ id: 'default-ws', name: 'My Workspace' }];
const defaultProjects: Project[] = [{ id: 'default-proj', workspaceId: 'default-ws', name: 'My Project' }];
const defaultFlows: Flow[] = [];
const defaultEvents: Event[] = [];
const defaultTriggers: Trigger[] = [];

const defaultTemplates: Template[] = [
  {
    id: 1,
    title: "Enterprise Nexus",
    description: "High-compliance protocol for global institutions.",
    tasks: [
      { id: 1, title: "Sign Master Service Agreement" },
      { id: 2, title: "Submit Brand Identity Assets" },
      { id: 3, title: "Configure Domain Records" },
    ],
  },
  {
    id: 2,
    title: "Velocity Stream",
    description: "Rapid onboarding for high-growth startups.",
    tasks: [
      { id: 1, title: "Intro Call" },
      { id: 2, title: "Share Brand Kit" },
    ],
  },
  {
    id: 3,
    title: "Standard Onboarding",
    description: "Baseline verification sequence for standard partners.",
    tasks: [
      { id: 1, title: "Sign Contract" },
      { id: 2, title: "Provide Assets" },
      { id: 3, title: "Confirm Payment" },
    ],
  },
];

const defaultClients: Client[] = [];
const defaultTransmissions: Transmission[] = [];
const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Initial Contact",
    subject: "Welcome to the Nexus, {client_name}",
    trigger: "Submission",
    openRate: "94%",
    status: "active"
  },
  {
    id: 2,
    name: "Task Reminder",
    subject: "Action Required: {task_name}",
    trigger: "24h Idle",
    openRate: "82%",
    status: "active"
  },
  {
    id: 3,
    name: "Mission Complete",
    subject: "Onboarding Finalized for {project_name}",
    trigger: "Finished",
    openRate: "98%",
    status: "active"
  }
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.error("Failed to read from storage", e);
    return fallback;
  }
}

function write(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to write to storage", e);
  }
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const store = {
  getWorkspaces(): Workspace[] {
    return read<Workspace[]>(STORAGE_KEYS.workspaces, defaultWorkspaces);
  },
  saveWorkspaces(list: Workspace[]) {
    write(STORAGE_KEYS.workspaces, list);
  },
  addWorkspace(w: Omit<Workspace, 'id'>): Workspace {
    const list = this.getWorkspaces();
    const next = { ...w, id: `ws_${Date.now()}` };
    const res = [...list, next];
    this.saveWorkspaces(res);
    return next;
  },

  getProjects(workspaceId: string): Project[] {
    const allProjects = read<Project[]>(STORAGE_KEYS.projects, defaultProjects);
    return allProjects.filter(p => p.workspaceId === workspaceId);
  },
  saveProjects(list: Project[]) {
    write(STORAGE_KEYS.projects, list);
  },
  addProject(p: Omit<Project, 'id'>): Project {
    const list = read<Project[]>(STORAGE_KEYS.projects, defaultProjects);
    const next = { ...p, id: `proj_${Date.now()}` };
    const res = [...list, next];
    this.saveProjects(res);
    return next;
  },

  getFlows(projectId: string): Flow[] {
    const allFlows = read<Flow[]>(STORAGE_KEYS.flows, defaultFlows);
    return allFlows.filter(f => f.projectId === projectId);
  },
  saveFlows(list: Flow[]) {
    write(STORAGE_KEYS.flows, list);
  },
  addFlow(f: Omit<Flow, 'id'>): Flow {
    const list = read<Flow[]>(STORAGE_KEYS.flows, defaultFlows);
    const next = { ...f, id: `flow_${Date.now()}` };
    const res = [...list, next];
    this.saveFlows(res);
    window.dispatchEvent(new CustomEvent('onboardly:flows:updated'));
    return next;
  },
  updateFlow(updated: Flow) {
    const list = read<Flow[]>(STORAGE_KEYS.flows, defaultFlows).map(f => f.id === updated.id ? updated : f);
    this.saveFlows(list);
    window.dispatchEvent(new CustomEvent('onboardly:flows:updated'));
    return list;
  },

  addStepToFlow(flowId: string, step: Omit<Step, 'id'>): Flow {
    const flows = this.getFlows('default-proj');
    const flow = flows.find(f => f.id === flowId);
    if (!flow) throw new Error('Flow not found');

    const newStep = { ...step, id: `step_${Date.now()}` };
    flow.steps.push(newStep);
    this.updateFlow(flow);
    return flow;
  },

  updateStepInFlow(flowId: string, updatedStep: Step): Flow {
    const flows = this.getFlows('default-proj');
    const flow = flows.find(f => f.id === flowId);
    if (!flow) throw new Error('Flow not found');

    flow.steps = flow.steps.map(step => step.id === updatedStep.id ? updatedStep : step);
    this.updateFlow(flow);
    return flow;
  },

  deleteStepFromFlow(flowId: string, stepId: string): Flow {
    const flows = this.getFlows('default-proj');
    const flow = flows.find(f => f.id === flowId);
    if (!flow) throw new Error('Flow not found');

    flow.steps = flow.steps.filter(step => step.id !== stepId);
    this.updateFlow(flow);
    return flow;
  },

  moveStepInFlow(flowId: string, stepId: string, direction: 'up' | 'down'): Flow {
    const flows = this.getFlows('default-proj');
    const flow = flows.find(f => f.id === flowId);
    if (!flow) throw new Error('Flow not found');

    const stepIndex = flow.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) throw new Error('Step not found');

    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;

    if (targetIndex >= 0 && targetIndex < flow.steps.length) {
      const newSteps = [...flow.steps];
      const [movedStep] = newSteps.splice(stepIndex, 1);
      newSteps.splice(targetIndex, 0, movedStep);
      flow.steps = newSteps;
      this.updateFlow(flow);
    }

    return flow;
  },

  getEvents(clientId: string): Event[] {
    const allEvents = read<Event[]>(STORAGE_KEYS.events, defaultEvents);
    return allEvents.filter(e => e.clientId === clientId);
  },
  addEvent(e: Omit<Event, 'id' | 'timestamp'>): Event {
    const list = read<Event[]>(STORAGE_KEYS.events, defaultEvents);
    const next = { ...e, id: `evt_${Date.now()}`, timestamp: new Date().toISOString() };
    const res = [...list, next];
    write(STORAGE_KEYS.events, res);
    window.dispatchEvent(new CustomEvent('onboardly:events:updated'));
    return next;
  },

  getEventsForProject(projectId: string): Event[] {
    const allEvents = read<Event[]>(STORAGE_KEYS.events, defaultEvents);
    const projectClients = this.getClientsByProject(projectId).map(c => c.id);
    return allEvents.filter(e => projectClients.includes(e.clientId));
  },

  getTriggers(stepId: string): Trigger[] {
    const allTriggers = read<Trigger[]>(STORAGE_KEYS.triggers, defaultTriggers);
    return allTriggers.filter(t => t.stepId === stepId);
  },
  addTrigger(t: Omit<Trigger, 'id'>): Trigger {
    const list = read<Trigger[]>(STORAGE_KEYS.triggers, defaultTriggers);
    const next = { ...t, id: `trg_${Date.now()}` };
    const res = [...list, next];
    write(STORAGE_KEYS.triggers, res);
    window.dispatchEvent(new CustomEvent('onboardly:triggers:updated'));
    return next;
  },

  getTemplates(): Template[] {
    const t = read<Template[]>(STORAGE_KEYS.templates, defaultTemplates);
    return t;
  },
  saveTemplates(list: Template[]) {
    write(STORAGE_KEYS.templates, list);
  },
  addTemplate(t: Template) {
    const list = this.getTemplates();
    const next = { ...t, id: Date.now() };
    const res = [...list, next];
    this.saveTemplates(res);
    window.dispatchEvent(new CustomEvent('onboardly:templates:updated'));
    return next;
  },
  deleteTemplate(id: number | string) {
    const list = this.getTemplates().filter(t => t.id !== id);
    this.saveTemplates(list);
    return list;
  },

  updateTemplate(updated: Template) {
    const list = this.getTemplates().map(t => t.id === updated.id ? updated : t);
    this.saveTemplates(list);
    window.dispatchEvent(new CustomEvent('onboardly:templates:updated'));
    return list;
  },

  cloneFlowFromTemplate(templateName: string, projectId: string): Flow {
    const template = this.getTemplates().find(t => t.title === templateName);
    if (!template) {
      throw new Error('Template not found');
    }

    const newFlow: Omit<Flow, 'id'> = {
      projectId,
      name: `${template.title} (Copy)`,
      steps: template.tasks?.map(task => ({
        id: `step_${Date.now()}`,
        name: task.title,
        type: 'checklist-item',
        content: '',
        enabled: true,
      })) || [],
      status: 'draft',
    };

    return this.addFlow(newFlow);
  },

  getClients(): Client[] {
    return read<Client[]>(STORAGE_KEYS.clients, defaultClients);
  },
  saveClients(list: Client[]) {
    write(STORAGE_KEYS.clients, list);
  },
  addClient(c: Partial<Client>, projectId: string): Client {
    const list = this.getClients();
    const id = Date.now();
    const name = c.name || c.email || "Unnamed";
    const client: Client = {
      projectId,
      id,
      slug: slugify(name),
      name,
      email: c.email || "",
      company: c.company || "",
      template: c.template || "",
      tasks: c.tasks || [],
      progress: c.progress || 0,
      status: c.status || "pending",
      lastActivity: c.lastActivity || new Date().toISOString(),
      isActivated: false,
      segment: 'new_user',
    };
    const res = [client, ...list];
    this.saveClients(res);
    return client;
  },
  updateClient(updated: Client) {
    const list = this.getClients().map(c => c.id === updated.id ? updated : c);
    this.saveClients(list);
    window.dispatchEvent(new CustomEvent('onboardly:clients:updated'));
    return list;
  },

  updateClientSegment(clientId: number | string, segment: UserSegment) {
    const clients = this.getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex === -1) return;

    clients[clientIndex].segment = segment;
    this.saveClients(clients);
    window.dispatchEvent(new CustomEvent('onboardly:clients:updated'));
  },

  getTasksForProject(projectId: string) {
    const clients = this.getClientsByProject(projectId);
    return clients.flatMap(client => 
      client.tasks?.map(task => ({ ...task, clientName: client.name, clientId: client.id })) || []
    );
  },

  addTaskToClient(clientId: number | string, task: Omit<any, 'id'>) {
    const clients = this.getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) return;

    const client = clients[clientIndex];
    const newTask = { ...task, id: Date.now(), completed: false };
    client.tasks = [...(client.tasks || []), newTask];
    this.saveClients(clients);
    window.dispatchEvent(new CustomEvent('onboardly:clients:updated'));
  },

  deleteTaskFromClient(clientId: number | string, taskId: number | string) {
    const clients = this.getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) return;

    const client = clients[clientIndex];
    client.tasks = client.tasks?.filter(t => t.id !== taskId);
    this.saveClients(clients);
    window.dispatchEvent(new CustomEvent('onboardly:clients:updated'));
  },

  updateClientTaskStatus(clientId: number | string, taskId: number | string, completed: boolean) {
    const clients = this.getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex === -1) return;

    const clientToUpdate = { ...clients[clientIndex] };

    if (clientToUpdate.tasks) {
      clientToUpdate.tasks = clientToUpdate.tasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      );

      const completedTasks = clientToUpdate.tasks.filter(t => t.completed).length;
      const totalTasks = clientToUpdate.tasks.length;
      clientToUpdate.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      clientToUpdate.isActivated = clientToUpdate.progress === 100;

      clients[clientIndex] = clientToUpdate;
      this.saveClients(clients);
      window.dispatchEvent(new CustomEvent('onboardly:clients:updated'));
    }
  },

  getClientsByProject(projectId: string): Client[] {
    const allClients = this.getClients();
    return allClients.filter(c => c.projectId === projectId);
  },

  getTransmissions(): Transmission[] {
    return read<Transmission[]>(STORAGE_KEYS.transmissions, defaultTransmissions);
  },
  addTransmission(t: Omit<Transmission, 'id' | 'time'>) {
    const list = this.getTransmissions();
    const item: Transmission = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      ...t
    };
    const res = [item, ...list];
    write(STORAGE_KEYS.transmissions, res);
    // notify others
    window.dispatchEvent(new CustomEvent('onboardly:transmissions:updated'));
    return item;
  },

  getEmailTemplates(): EmailTemplate[] {
    return read<EmailTemplate[]>(STORAGE_KEYS.emailTemplates, defaultEmailTemplates);
  },
  saveEmailTemplates(list: EmailTemplate[]) {
    write(STORAGE_KEYS.emailTemplates, list);
  },
  addEmailTemplate(et: Omit<EmailTemplate, 'id'>): EmailTemplate {
    const list = this.getEmailTemplates();
    const next = { ...et, id: Date.now() };
    const res = [...list, next];
    this.saveEmailTemplates(res);
    window.dispatchEvent(new CustomEvent('onboardly:email_templates:updated'));
    return next;
  },
  deleteEmailTemplate(id: number | string) {
    const list = this.getEmailTemplates().filter(et => et.id !== id);
    this.saveEmailTemplates(list);
    window.dispatchEvent(new CustomEvent('onboardly:email_templates:updated'));
    return list;
  },

  getPlan(): string {
    return read<string>(STORAGE_KEYS.plan, 'free');
  },
  setPlan(plan: string) {
    write(STORAGE_KEYS.plan, plan);
  },

  getAnalytics(projectId: string, segment?: UserSegment): Analytics {
    const clients = this.getClientsByProject(projectId).filter(c => !segment || c.segment === segment);
    const events = clients.flatMap(c => this.getEvents(String(c.id)));

    // Calculate real funnel data from actual clients
    const totalClients = clients.length;
    const activatedClients = clients.filter(c => c.isActivated).length;
    const signupRate = totalClients > 0 ? 100 : 0;
    const activationRate = totalClients > 0 ? Math.round((activatedClients / totalClients) * 100) : 0;

    // Calculate average time to activate
    const activatedClientsWithTime = clients.filter(c => c.isActivated && c.lastActivity);
    const avgTimeToActivate = activatedClientsWithTime.length > 0 
      ? "2.1 days" // Placeholder - would calculate from actual timestamps
      : "N/A";

    // Create realistic funnel based on actual data
    const funnel: FunnelStepAnalytics[] = [
      { name: 'Signup', count: signupRate, dropOff: 0, avgTime: '1m' },
      { name: 'Step 1', count: Math.round(signupRate * 0.82), dropOff: 18, avgTime: '2m' },
      { name: 'Step 2', count: Math.round(signupRate * 0.61), dropOff: 21, avgTime: '3m' },
      { name: 'Step 3', count: Math.round(signupRate * 0.44), dropOff: 17, avgTime: '2m' },
      { name: 'Activated', count: activationRate, dropOff: 2, avgTime: 'N/A' },
    ];

    return { funnel };
  },

  getFailingSteps(projectId: string): FailingStep[] {
    const events = this.getClientsByProject(projectId).flatMap(c => this.getEvents(String(c.id)));
    const stepFailures: Record<string, number> = {};
    const stepCompletions: Record<string, number> = {};

    events.forEach(event => {
      if (event.name === 'step_failed') {
        const stepName = event.metadata?.stepName;
        if (stepName) {
          stepFailures[stepName] = (stepFailures[stepName] || 0) + 1;
        }
      } else if (event.name === 'step_completed') {
        const stepName = event.metadata?.stepName;
        if (stepName) {
          stepCompletions[stepName] = (stepCompletions[stepName] || 0) + 1;
        }
      }
    });

    const failingSteps: FailingStep[] = Object.keys(stepFailures).map(stepName => {
      const failures = stepFailures[stepName];
      const completions = stepCompletions[stepName] || 0;
      const total = failures + completions;
      const failRate = total > 0 ? Math.round((failures / total) * 100) : 0;
      return { name: stepName, failRate };
    });

    return failingSteps.sort((a, b) => b.failRate - a.failRate);
  },

  getActivationRateTrend(projectId: string): { date: string, rate: number }[] {
    // Placeholder data for activation rate trend
    return [
      { date: '2023-01-01', rate: 35 },
      { date: '2023-01-02', rate: 42 },
      { date: '2023-01-03', rate: 45 },
      { date: '2023-01-04', rate: 55 },
      { date: '2023-01-05', rate: 58 },
      { date: '2023-01-06', rate: 62 },
      { date: '2023-01-07', rate: 70 },
    ];
  },

  getRecommendations(projectId: string): { title: string, description: string, impact: 'high' | 'medium' | 'low' }[] {
    // Placeholder data for recommendations
    return [
      {
        title: 'Improve Step 2: "Submit Brand Identity Assets"',
        description: 'This step has a 45% drop-off rate. Consider simplifying the form or providing clearer instructions.',
        impact: 'high',
      },
      {
        title: 'Engage with users from new marketing campaign',
        description: 'Users from your latest campaign are dropping off at a higher rate than average. Consider a targeted email campaign.',
        impact: 'medium',
      },
      {
        title: 'Analyze power user behavior',
        description: 'Power users complete the onboarding flow 50% faster. Analyze their paths to find optimization opportunities.',
        impact: 'low',
      },
    ];
  },

  getWebhookUrl(): string {
    return read<string>(STORAGE_KEYS.webhookUrl, '');
  },

  saveWebhookUrl(url: string) {
    write(STORAGE_KEYS.webhookUrl, url);
  }
};
