export type Template = {
  id: number | string;
  title: string;
  description?: string;
  tasks?: Array<{ id: number | string; title: string; completed?: boolean }>;
};

export type Client = {
  id: number | string;
  slug: string;
  name: string;
  email: string;
  company?: string;
  template?: string;
  tasks?: Array<{ id: number | string; title: string; completed?: boolean; deadline?: string }>;
  progress?: number;
  status?: string;
  lastActivity?: string;
};

export type Transmission = {
  id: number | string;
  client: string;
  template: string;
  time: string;
  status: string; // sent|opened|bounced
};

const STORAGE_KEYS = {
  templates: "onboardly.templates",
  clients: "onboardly.clients",
  transmissions: "onboardly.transmissions",
  plan: "onboardly.plan",
};

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
  getClients(): Client[] {
    return read<Client[]>(STORAGE_KEYS.clients, defaultClients);
  },
  saveClients(list: Client[]) {
    write(STORAGE_KEYS.clients, list);
  },
  addClient(c: Partial<Client>): Client {
    const list = this.getClients();
    const id = Date.now();
    const name = c.name || c.email || "Unnamed";
    const client: Client = {
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
  getPlan(): string {
    return read<string>(STORAGE_KEYS.plan, 'free');
  },
  setPlan(plan: string) {
    write(STORAGE_KEYS.plan, plan);
  }
};
