import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ── types ── */
export type UserRole =
  | "forensic_analyst"
  | "lab_technician"
  | "case_manager"
  | "court_officer";

export const ROLE_LABELS: Record<UserRole, string> = {
  forensic_analyst: "Forensic Analyst",
  lab_technician: "Lab Technician",
  case_manager: "Case Manager",
  court_officer: "Court Officer",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  forensic_analyst: "Capture evidence, verify integrity, and browse the registry",
  lab_technician: "Handle custody transfers, verify evidence, and view activity",
  case_manager: "Full access to all features — manage the entire evidence lifecycle",
  court_officer: "Verify evidence integrity and browse the evidence registry",
};

/**
 * Maps each role to the route paths it can access.
 * The home page (/), /login, /register are always accessible.
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  forensic_analyst: ["/intake", "/verify", "/registry", "/activity"],
  lab_technician: ["/transfer", "/verify", "/registry", "/activity"],
  case_manager: ["/intake", "/transfer", "/verify", "/registry", "/activity"],
  court_officer: ["/verify", "/registry"],
};

export type User = {
  name: string;
  email: string;
  role: UserRole;
};

type StoredUser = User & { passwordHash: string };

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<string | null>;
  logout: () => void;
  canAccess: (path: string) => boolean;
};

/* ── constants ── */
const USERS_KEY = "chainproof-users";
const SESSION_KEY = "chainproof-auth-session";

/* ── helpers ── */
async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSessionUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveSessionUser(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

/* ── context ── */
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Hydrate session on mount
  useEffect(() => {
    const stored = getSessionUser();
    if (stored) setUser(stored);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return "No account found with this email.";

    const hash = await hashPassword(password);
    if (hash !== found.passwordHash) return "Incorrect password.";

    const sessionUser: User = { name: found.name, email: found.email, role: found.role };
    setUser(sessionUser);
    saveSessionUser(sessionUser);
    return null;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<string | null> => {
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "An account with this email already exists.";
    }

    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = { name, email, passwordHash, role };
    saveStoredUsers([...users, newUser]);

    const sessionUser: User = { name, email, role };
    setUser(sessionUser);
    saveSessionUser(sessionUser);
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSessionUser(null);
  }, []);

  const canAccess = useCallback((path: string): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(path);
  }, [user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
