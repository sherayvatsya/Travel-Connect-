import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Apple,
  ArrowRight,
  Bus,
  Check,
  ChevronRight,
  CircleAlert,
  Globe,
  KeyRound,
  LoaderCircle,
  Lock,
  Mail,
  MapPinned,
  Moon,
  Phone,
  Shield,
  Sparkles,
  Sun,
  UserRound,
} from 'lucide-react';
import { Role, useApp } from '../context/AppContext';
import travelConnectAuthBg from '../assets/travel_connect_auth_bg.png';

type AuthView = 'login' | 'register' | 'forgot';
type ForgotStep = 'identify' | 'security' | 'verify' | 'reset' | 'success';
type SocialProvider = 'google' | 'apple';
type RegistrationRole =
  | 'customer'
  | 'driver'
  | 'bus_operator'
  | 'cab_operator'
  | 'auto_driver'
  | 'bike_taxi'
  | 'transport_company';

interface RoleOption {
  id: RegistrationRole;
  label: string;
  description: string;
  accent: string;
  appRole: Role;
  vehicleType?: 'cab' | 'bus' | 'auto' | 'bike';
}

interface SecurityQuestionOption {
  value: string;
  label: string;
}

interface AuthAccount {
  fullName: string;
  email: string;
  phone: string;
  registrationRole: RegistrationRole;
  appRole: Role;
  passwordHash: string;
  passwordSalt: string;
  securityQuestion: string;
  securityAnswerHash: string;
  securityAnswerSalt: string;
  providers: SocialProvider[];
  createdAt: string;
  resetOtp?: string;
  resetOtpExpiresAt?: string;
}

interface SessionPayload {
  email: string;
  role: Role;
  token: string;
  expiresAt: string;
}

const AUTH_ACCOUNTS_STORAGE_KEY = 'travelconnect.auth.accounts';
const AUTH_SESSION_STORAGE_KEY = 'travelconnect.auth.session';
const AUTH_SESSION_FALLBACK_KEY = 'travelconnect.auth.session.temp';

const roleOptions: RoleOption[] = [
  { id: 'customer', label: 'Customer', description: 'Book and track every leg of the journey.', accent: 'from-blue-500 to-cyan-400', appRole: 'customer' },
  { id: 'driver', label: 'Driver', description: 'Access assigned rides and live trip updates.', accent: 'from-slate-900 to-slate-700', appRole: 'cab_driver', vehicleType: 'cab' },
  { id: 'bus_operator', label: 'Bus Operator', description: 'Manage buses, schedules, and manifests.', accent: 'from-indigo-600 to-blue-500', appRole: 'bus_operator', vehicleType: 'bus' },
  { id: 'cab_operator', label: 'Cab Operator', description: 'Coordinate cab fleets and dispatching.', accent: 'from-sky-600 to-blue-500', appRole: 'cab_driver', vehicleType: 'cab' },
  { id: 'auto_driver', label: 'Auto Driver', description: 'Run local rides with route visibility.', accent: 'from-emerald-500 to-lime-400', appRole: 'auto_driver', vehicleType: 'auto' },
  { id: 'bike_taxi', label: 'Bike Taxi', description: 'Handle fast first-mile and last-mile trips.', accent: 'from-violet-600 to-fuchsia-500', appRole: 'bike_driver', vehicleType: 'bike' },
  { id: 'transport_company', label: 'Transport Company', description: 'Operate multi-vehicle regional services.', accent: 'from-amber-500 to-orange-500', appRole: 'bus_operator', vehicleType: 'bus' },
];

const securityQuestions: SecurityQuestionOption[] = [
  { value: 'first_trip', label: 'What was the destination of your first memorable trip?' },
  { value: 'favorite_route', label: 'Which route do you book most often?' },
  { value: 'mother_maiden', label: 'What is your mother’s maiden name?' },
  { value: 'childhood_city', label: 'Which city did you grow up in?' },
  { value: 'first_vehicle', label: 'What was the first vehicle you learned to ride or drive?' },
];

const demoAccounts = [
  {
    fullName: 'John Doe',
    email: 'john@gmail.com',
    phone: '9876543210',
    registrationRole: 'customer' as const,
    appRole: 'customer' as const,
    password: 'Travel@123',
    securityQuestion: 'favorite_route',
    securityAnswer: 'delhi jaipur',
    providers: ['google', 'apple'] as SocialProvider[],
  },
  {
    fullName: 'Ramesh Kumar',
    email: 'ramesh@bus.com',
    phone: '9123456789',
    registrationRole: 'bus_operator' as const,
    appRole: 'bus_operator' as const,
    password: 'Travel@123',
    securityQuestion: 'first_trip',
    securityAnswer: 'manali',
    providers: ['google'] as SocialProvider[],
  },
  {
    fullName: 'David Cabby',
    email: 'david@cab.com',
    phone: '9234567890',
    registrationRole: 'cab_operator' as const,
    appRole: 'cab_driver' as const,
    password: 'Travel@123',
    securityQuestion: 'first_vehicle',
    securityAnswer: 'scooter',
    providers: ['apple'] as SocialProvider[],
  },
  {
    fullName: 'Ravi Auto',
    email: 'ravi@auto.com',
    phone: '9345678901',
    registrationRole: 'auto_driver' as const,
    appRole: 'auto_driver' as const,
    password: 'Travel@123',
    securityQuestion: 'childhood_city',
    securityAnswer: 'jaipur',
    providers: ['google'] as SocialProvider[],
  },
  {
    fullName: 'Admin User',
    email: 'admin@travelconnect.com',
    phone: '9999999999',
    registrationRole: 'transport_company' as const,
    appRole: 'admin' as const,
    password: 'Travel@123',
    securityQuestion: 'mother_maiden',
    securityAnswer: 'sharma',
    providers: ['google', 'apple'] as SocialProvider[],
  },
];

const encoder = new TextEncoder();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeIdentifier = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.replace(/\D/g, '');

const randomToken = (length = 24) =>
  Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);

const buildMockJwt = (email: string, role: Role) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: email, role, iat: Date.now() }));
  const signature = randomToken(32);
  return `${header}.${payload}.${signature}`;
};

const hashSecret = async (secret: string, salt: string) => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`${salt}:${secret}`));
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
};

const readStoredAccounts = () => {
  if (typeof window === 'undefined') return [] as AuthAccount[];

  try {
    const raw = window.localStorage.getItem(AUTH_ACCOUNTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthAccount[]) : [];
  } catch {
    return [];
  }
};

const writeStoredAccounts = (accounts: AuthAccount[]) => {
  window.localStorage.setItem(AUTH_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
};

const writeSession = (session: SessionPayload, rememberMe: boolean) => {
  if (rememberMe) {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    window.sessionStorage.removeItem(AUTH_SESSION_FALLBACK_KEY);
    return;
  }

  window.sessionStorage.setItem(AUTH_SESSION_FALLBACK_KEY, JSON.stringify(session));
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

const findRoleOption = (registrationRole: RegistrationRole) =>
  roleOptions.find((role) => role.id === registrationRole) ?? roleOptions[0];

const findAccount = (accounts: AuthAccount[], identifier: string) => {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const normalizedPhone = normalizePhone(identifier);

  return accounts.find(
    (account) =>
      normalizeIdentifier(account.email) === normalizedIdentifier ||
      normalizePhone(account.phone) === normalizedPhone
  );
};

const fieldBaseClass =
  'w-full rounded-2xl border px-4 py-3.5 text-sm font-medium transition focus:outline-none focus:ring-4 bg-white/75 dark:bg-slate-950/45 backdrop-blur-md';

function AuthTextField({
  label,
  icon,
  error,
  trailing,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: React.ReactNode;
  error?: string;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          {icon}
        </span>
        <input
          {...props}
          className={`${fieldBaseClass} pl-11 pr-12 ${
            error
              ? 'border-red-300 text-slate-900 dark:border-red-500/60 dark:text-white focus:ring-red-500/15'
              : 'border-slate-200 text-slate-900 dark:border-slate-800 dark:text-white focus:border-[#2563EB] focus:ring-blue-500/15'
          } ${className}`}
        />
        {trailing ? <div className="absolute right-4 top-1/2 -translate-y-1/2">{trailing}</div> : null}
      </div>
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </label>
  );
}

function AuthSelectField({
  label,
  icon,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  icon: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          {icon}
        </span>
        <select
          {...props}
          className={`${fieldBaseClass} appearance-none pl-11 pr-12 ${
            error
              ? 'border-red-300 text-slate-900 dark:border-red-500/60 dark:text-white'
              : 'border-slate-200 text-slate-900 dark:border-slate-800 dark:text-white'
          }`}
        >
          {children}
        </select>
        <ChevronRight className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 rotate-90 text-slate-400 dark:text-slate-500" />
      </div>
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </label>
  );
}

function SocialButton({
  provider,
  onClick,
  loading,
}: {
  provider: SocialProvider;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-100"
      disabled={loading}
    >
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : provider === 'google' ? (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.21 3.31v2.77h3.57a10.06 10.06 0 0 0 3.28-8.09Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77a6.43 6.43 0 0 1-3.71 1.06 6.18 6.18 0 0 1-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.09A6.62 6.62 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.06H2.18A11.02 11.02 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l2.85-2.22.81-.63Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06L5.84 9.9A6.18 6.18 0 0 1 12 5.38Z" />
        </svg>
      ) : (
        <Apple className="size-4" />
      )}
      <span>{provider === 'google' ? 'Continue with Google' : 'Continue with Apple'}</span>
    </button>
  );
}

export function AuthModule() {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    setCurrentScreen,
    login,
    registerCustomer,
    registerProvider,
    addNotification,
  } = useApp();
  const [view, setView] = useState<AuthView>('login');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('identify');
  const [bootstrapped, setBootstrapped] = useState(false);
  const [accounts, setAccounts] = useState<AuthAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registrationRole, setRegistrationRole] = useState<RegistrationRole>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState(securityQuestions[0].value);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotAccount, setForgotAccount] = useState<AuthAccount | null>(null);
  const [demoOtpHint, setDemoOtpHint] = useState('');

  const selectedRole = useMemo(() => findRoleOption(registrationRole), [registrationRole]);

  useEffect(() => {
    let mounted = true;

    const bootstrapAccounts = async () => {
      const existing = readStoredAccounts();
      if (existing.length > 0) {
        if (mounted) {
          setAccounts(existing);
          setBootstrapped(true);
        }
        return;
      }

      const seeded: AuthAccount[] = [];
      for (const account of demoAccounts) {
        const passwordSalt = randomToken(16);
        const securitySalt = randomToken(16);
        seeded.push({
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
          registrationRole: account.registrationRole,
          appRole: account.appRole,
          passwordHash: await hashSecret(account.password, passwordSalt),
          passwordSalt,
          securityQuestion: account.securityQuestion,
          securityAnswerHash: await hashSecret(account.securityAnswer, securitySalt),
          securityAnswerSalt: securitySalt,
          providers: account.providers,
          createdAt: new Date().toISOString(),
        });
      }

      writeStoredAccounts(seeded);
      if (mounted) {
        setAccounts(seeded);
        setBootstrapped(true);
      }
    };

    void bootstrapAccounts();
    return () => {
      mounted = false;
    };
  }, []);

  const persistAccounts = (nextAccounts: AuthAccount[]) => {
    setAccounts(nextAccounts);
    writeStoredAccounts(nextAccounts);
  };

  const resetAlerts = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const resetForgotFlow = () => {
    setForgotStep('identify');
    setForgotIdentifier('');
    setForgotAnswer('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotAccount(null);
    setDemoOtpHint('');
    resetAlerts();
  };

  const validatePassword = (secret: string) => {
    if (secret.length < 8) return 'Use at least 8 characters.';
    if (!/[A-Z]/.test(secret)) return 'Include at least one uppercase letter.';
    if (!/[a-z]/.test(secret)) return 'Include at least one lowercase letter.';
    if (!/\d/.test(secret)) return 'Include at least one number.';
    return '';
  };

  const finalizeSession = async (account: AuthAccount, persist: boolean) => {
    const expiresAt = new Date(Date.now() + (persist ? 1000 * 60 * 60 * 24 * 14 : 1000 * 60 * 60 * 12)).toISOString();
    writeSession(
      {
        email: account.email,
        role: account.appRole,
        token: buildMockJwt(account.email, account.appRole),
        expiresAt,
      },
      persist
    );

    await Promise.resolve(login(account.email, account.appRole));
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    resetAlerts();

    const account = findAccount(accounts, loginIdentifier);
    if (!account) {
      setErrorMessage('No account matched that email or mobile number.');
      return;
    }

    const hashed = await hashSecret(loginPassword, account.passwordSalt);
    if (hashed !== account.passwordHash) {
      setErrorMessage('Incorrect password. Please try again.');
      return;
    }

    setLoading(true);
    await sleep(650);
    await finalizeSession(account, rememberMe);
    setLoading(false);
    setSuccessMessage('Signed in successfully. Redirecting to your dashboard...');
  };

  const handleRegister = async (provider?: SocialProvider) => {
    resetAlerts();

    const passwordError = provider ? '' : validatePassword(password);
    if (!fullName.trim() || !email.trim() || normalizePhone(mobile).length < 10) {
      setErrorMessage('Please complete your full name, email, and mobile number.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage('Please accept the Terms and Privacy Policy to continue.');
      return;
    }
    if (!securityAnswer.trim()) {
      setErrorMessage('Please choose a security question and provide an answer.');
      return;
    }
    if (!provider && passwordError) {
      setErrorMessage(passwordError);
      return;
    }
    if (!provider && password !== confirmPassword) {
      setErrorMessage('Password and confirm password do not match.');
      return;
    }
    if (findAccount(accounts, email) || findAccount(accounts, mobile)) {
      setErrorMessage('An account already exists with that email or mobile number.');
      return;
    }

    const passwordSalt = randomToken(16);
    const securitySalt = randomToken(16);
    const passwordToStore = provider ? `oauth:${provider}:${randomToken(12)}` : password;
    const nextAccount: AuthAccount = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: normalizePhone(mobile),
      registrationRole,
      appRole: selectedRole.appRole,
      passwordHash: await hashSecret(passwordToStore, passwordSalt),
      passwordSalt,
      securityQuestion,
      securityAnswerHash: await hashSecret(securityAnswer.trim().toLowerCase(), securitySalt),
      securityAnswerSalt: securitySalt,
      providers: provider ? [provider] : [],
      createdAt: new Date().toISOString(),
    };

    const nextAccounts = [...accounts, nextAccount];
    persistAccounts(nextAccounts);

    const registered =
      selectedRole.appRole === 'customer'
        ? registerCustomer(nextAccount.fullName, nextAccount.email, nextAccount.phone, passwordToStore)
        : (() => {
      const vehicleType = selectedRole.vehicleType ?? 'cab';
      const businessName =
        registrationRole === 'transport_company' ? `${nextAccount.fullName} Transport Company` : `${nextAccount.fullName} Mobility`;
      const vehicleNumber = `TC-${nextAccount.phone.slice(-4)}`;
      const licenseNumber = `${vehicleType.toUpperCase()}-${Date.now().toString().slice(-6)}`;
      return registerProvider(
        nextAccount.fullName,
        nextAccount.email,
        nextAccount.phone,
        businessName,
        vehicleType,
        vehicleNumber,
        licenseNumber
      );
    })();

    if (!registered) {
      persistAccounts(accounts);
      setErrorMessage('Registration could not be completed. That account may already exist in the app.');
      return;
    }

    await finalizeSession(nextAccount, true);
    addNotification(
      'Authentication Ready',
      `${provider ? `Signed up with ${provider}` : 'Account created'} for ${nextAccount.fullName}.`,
      'success'
    );
    setSuccessMessage('Your premium travel account is ready.');
  };

  const handleSocialAction = async (provider: SocialProvider) => {
    resetAlerts();
    setSocialLoading(provider);
    await sleep(850);

    if (view === 'register') {
      await handleRegister(provider);
      setSocialLoading(null);
      return;
    }

    const identifier = loginIdentifier.trim() || email.trim() || demoAccounts[0].email;
    const account = findAccount(accounts, identifier);

    if (!account) {
      setErrorMessage(`No account matched ${identifier}. Enter your email/mobile or create an account first.`);
      setSocialLoading(null);
      return;
    }

    const nextAccounts = accounts.map((item) =>
      item.email === account.email && !item.providers.includes(provider)
        ? { ...item, providers: [...item.providers, provider] }
        : item
    );
    persistAccounts(nextAccounts);

    const refreshed = findAccount(nextAccounts, identifier);
    if (!refreshed) {
      setSocialLoading(null);
      return;
    }

    await finalizeSession(refreshed, rememberMe);
    setSuccessMessage(`Authenticated with ${provider === 'google' ? 'Google OAuth' : 'Apple Sign-In'}.`);
    setSocialLoading(null);
  };

  const handleForgotIdentify = async (event: FormEvent) => {
    event.preventDefault();
    resetAlerts();
    const account = findAccount(accounts, forgotIdentifier);

    if (!account) {
      setErrorMessage('We could not find that email or mobile number.');
      return;
    }

    setForgotAccount(account);
    setForgotStep('security');
  };

  const handleForgotSecurity = async (event: FormEvent) => {
    event.preventDefault();
    resetAlerts();
    if (!forgotAccount) return;

    const answerHash = await hashSecret(forgotAnswer.trim().toLowerCase(), forgotAccount.securityAnswerSalt);
    if (answerHash !== forgotAccount.securityAnswerHash) {
      setErrorMessage('Security answer did not match our records.');
      return;
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const nextAccounts = accounts.map((account) =>
      account.email === forgotAccount.email
        ? {
            ...account,
            resetOtp: otp,
            resetOtpExpiresAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
          }
        : account
    );

    persistAccounts(nextAccounts);
    const refreshed = findAccount(nextAccounts, forgotAccount.email);
    setForgotAccount(refreshed ?? forgotAccount);
    setDemoOtpHint(otp);
    setForgotStep('verify');
    setSuccessMessage('A verification code has been sent to your registered contact method.');
  };

  const handleForgotVerify = (event: FormEvent) => {
    event.preventDefault();
    resetAlerts();
    if (!forgotAccount?.resetOtp || !forgotAccount.resetOtpExpiresAt) {
      setErrorMessage('Please request a fresh verification code.');
      return;
    }

    if (new Date(forgotAccount.resetOtpExpiresAt).getTime() < Date.now()) {
      setErrorMessage('That verification code has expired. Request a new one.');
      return;
    }

    if (forgotOtp.trim() !== forgotAccount.resetOtp) {
      setErrorMessage('The verification code is incorrect.');
      return;
    }

    setForgotStep('reset');
  };

  const handleForgotReset = async (event: FormEvent) => {
    event.preventDefault();
    resetAlerts();
    if (!forgotAccount) return;

    const passwordError = validatePassword(forgotNewPassword);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('The new password and confirmation do not match.');
      return;
    }

    const nextAccounts = [...accounts];
    const accountIndex = nextAccounts.findIndex((account) => account.email === forgotAccount.email);
    if (accountIndex === -1) return;

    const passwordSalt = randomToken(16);
    nextAccounts[accountIndex] = {
      ...nextAccounts[accountIndex],
      passwordSalt,
      passwordHash: await hashSecret(forgotNewPassword, passwordSalt),
      resetOtp: undefined,
      resetOtpExpiresAt: undefined,
    };

    persistAccounts(nextAccounts);
    setForgotAccount(nextAccounts[accountIndex]);
    setForgotStep('success');
    setSuccessMessage('Password updated successfully. You can sign in now.');
  };

  const renderForgotStep = () => {
    if (!forgotAccount) {
      return null;
    }

    const securityQuestionLabel =
      securityQuestions.find((question) => question.value === forgotAccount.securityQuestion)?.label ?? 'Security question';

    if (forgotStep === 'security') {
      return (
        <form onSubmit={handleForgotSecurity} className="space-y-5">
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Step 2</p>
            <p className="mt-2 font-semibold">{securityQuestionLabel}</p>
          </div>
          <AuthTextField
            label="Security Answer"
            icon={<Shield className="size-4" />}
            value={forgotAnswer}
            onChange={(event) => setForgotAnswer(event.target.value)}
            placeholder="Enter your answer"
          />
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
            Verify Answer
            <ArrowRight className="size-4" />
          </button>
        </form>
      );
    }

    if (forgotStep === 'verify') {
      return (
        <form onSubmit={handleForgotVerify} className="space-y-5">
          <div className="rounded-3xl border border-emerald-200/70 bg-emerald-50/90 p-4 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">Step 3</p>
            <p className="mt-2">OTP sent to your registered email/mobile.</p>
            <p className="mt-2 text-xs font-semibold">Demo verification code: {demoOtpHint}</p>
          </div>
          <AuthTextField
            label="Enter OTP"
            icon={<KeyRound className="size-4" />}
            value={forgotOtp}
            onChange={(event) => setForgotOtp(event.target.value)}
            placeholder="6-digit verification code"
            inputMode="numeric"
          />
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
            Continue to Reset
            <ArrowRight className="size-4" />
          </button>
        </form>
      );
    }

    if (forgotStep === 'reset') {
      return (
        <form onSubmit={handleForgotReset} className="space-y-5">
          <AuthTextField
            label="New Password"
            icon={<Lock className="size-4" />}
            value={forgotNewPassword}
            onChange={(event) => setForgotNewPassword(event.target.value)}
            placeholder="Create a strong password"
            type={showPassword ? 'text' : 'password'}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            }
          />
          <AuthTextField
            label="Confirm Password"
            icon={<Lock className="size-4" />}
            value={forgotConfirmPassword}
            onChange={(event) => setForgotConfirmPassword(event.target.value)}
            placeholder="Confirm your new password"
            type={showConfirmPassword ? 'text' : 'password'}
            trailing={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            }
          />
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
            Reset Password
            <ArrowRight className="size-4" />
          </button>
        </form>
      );
    }

    return (
      <div className="space-y-5">
        <div className="rounded-[28px] border border-emerald-200/80 bg-emerald-50/90 p-6 text-center dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
            <Check className="size-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Password Reset Complete</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Your account is secured again. Sign back in to continue planning and managing trips.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setView('login');
            setLoginIdentifier(forgotAccount.email);
            resetForgotFlow();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          Return to Login
          <ArrowRight className="size-4" />
        </button>
      </div>
    );
  };

  const heroStats = [
    { value: '24/7', label: 'secure session monitoring' },
    { value: '7 roles', label: 'ready for traveler and operator access' },
    { value: 'AA', label: 'accessible contrast and form states' },
  ];

  if (!bootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#020817]">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          <LoaderCircle className="size-4 animate-spin text-[#2563EB]" />
          Preparing secure authentication...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.14),_transparent_26%)] px-4 py-4 text-slate-900 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.12),_transparent_24%),linear-gradient(180deg,_#020817,_#0f172a)] dark:text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/70 to-transparent dark:from-white/5" />
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-white/60 bg-[#0F172A] text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] dark:border-white/10">
          <img src={travelConnectAuthBg} alt="TravelConnect authentication background" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(15,23,42,0.84),rgba(15,23,42,0.94))]" />
          <div className="absolute -left-10 top-16 size-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-12 right-0 size-56 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentScreen('welcome')}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:bg-white/15"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                  <MapPinned className="size-4" />
                </span>
                TravelConnect+
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md transition hover:bg-white/15"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>

                <label className="rounded-2xl border border-white/10 bg-white/10 px-3 backdrop-blur-md">
                  <span className="sr-only">Language</span>
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-white/70" />
                    <select
                      value={language}
                      onChange={(event) => setLanguage(event.target.value as 'en' | 'es' | 'hi')}
                      className="bg-transparent py-3 text-sm font-semibold text-white outline-none"
                    >
                      <option value="en" className="text-slate-900">English</option>
                      <option value="hi" className="text-slate-900">Hindi</option>
                      <option value="es" className="text-slate-900">Spanish</option>
                    </select>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-10 max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                <Sparkles className="size-4" />
                Premium Authentication Experience
              </div>

              <div className="space-y-5">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Secure every travel journey with a polished cross-device access flow.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Glassmorphism surfaces, role-aware onboarding, OTP recovery, and premium dark and light theming built for customers, operators, and transport teams.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Included in the flow</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      'JWT-style session token storage',
                      'SHA-256 password and answer hashing',
                      'Role-based login and dashboard routing',
                      'Forgot password with OTP verification',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                        <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                          <Check className="size-4" />
                        </span>
                        <span className="text-sm text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/12 to-white/5 p-5 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Demo credentials</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-200">
                    <div className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                      <p className="font-semibold">Use any seeded demo account</p>
                      <p className="mt-1 text-slate-300">Email: `john@gmail.com`</p>
                      <p className="text-slate-300">Password: `Travel@123`</p>
                    </div>
                    <p className="text-xs leading-6 text-slate-300">
                      Google and Apple actions are wired as functional demo OAuth entry points for this prototype.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full max-w-xl rounded-[36px] border border-white/70 bg-white/75 p-5 shadow-[0_30px_80px_rgba(37,99,235,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60 sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                  {view === 'login' ? 'Login' : view === 'register' ? 'Registration' : 'Password Recovery'}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {view === 'login'
                    ? 'Welcome back'
                    : view === 'register'
                      ? 'Create your travel access'
                      : 'Recover your account'}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {view === 'login'
                    ? 'Sign in with email or mobile, then head straight to your tailored dashboard.'
                    : view === 'register'
                      ? 'Complete the details below to set up a polished, secure account.'
                      : 'Verify your identity with security answers and OTP before resetting your password.'}
                </p>
              </div>

              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                WCAG AA Ready
              </div>
            </div>

            <div className="mt-6 flex rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900/80">
              {[
                { id: 'login', label: 'Login' },
                { id: 'register', label: 'Register' },
                { id: 'forgot', label: 'Forgot Password' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setView(tab.id as AuthView);
                    resetAlerts();
                    if (tab.id !== 'forgot') resetForgotFlow();
                  }}
                  className={`flex-1 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                    view === tab.id
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.24 }}
                className="mt-6"
              >
                {errorMessage ? (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                ) : null}

                {view === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-5">
                    <AuthTextField
                      label="Email or Mobile"
                      icon={<Mail className="size-4" />}
                      value={loginIdentifier}
                      onChange={(event) => setLoginIdentifier(event.target.value)}
                      placeholder="name@example.com or 9876543210"
                    />
                    <AuthTextField
                      label="Password"
                      icon={<Lock className="size-4" />}
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="text-xs font-semibold text-slate-500 dark:text-slate-400"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      }
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <label className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                          className="size-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        Remember Me
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setView('forgot');
                          resetForgotFlow();
                        }}
                        className="font-semibold text-[#2563EB] transition hover:text-blue-700"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
                      Login
                    </button>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <SocialButton provider="google" onClick={() => void handleSocialAction('google')} loading={socialLoading === 'google'} />
                      <SocialButton provider="apple" onClick={() => void handleSocialAction('apple')} loading={socialLoading === 'apple'} />
                    </div>
                  </form>
                ) : null}

                {view === 'register' ? (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {roleOptions.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setRegistrationRole(role.id)}
                          className={`rounded-[28px] border p-4 text-left transition ${
                            registrationRole === role.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-600/10 dark:border-blue-400 dark:bg-blue-500/10'
                              : 'border-slate-200 bg-white/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/35'
                          }`}
                        >
                          <div className={`inline-flex rounded-full bg-gradient-to-r ${role.accent} px-3 py-1 text-[11px] font-semibold text-white`}>
                            {role.label}
                          </div>
                          <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{role.label}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{role.description}</p>
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <AuthTextField
                        label="Full Name"
                        icon={<UserRound className="size-4" />}
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Enter your full name"
                      />
                      <AuthTextField
                        label="Email"
                        icon={<Mail className="size-4" />}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                        type="email"
                      />
                      <AuthTextField
                        label="Mobile"
                        icon={<Phone className="size-4" />}
                        value={mobile}
                        onChange={(event) => setMobile(event.target.value)}
                        placeholder="Enter your mobile number"
                        inputMode="tel"
                      />
                      <AuthSelectField
                        label="Security Question"
                        icon={<Shield className="size-4" />}
                        value={securityQuestion}
                        onChange={(event) => setSecurityQuestion(event.target.value)}
                      >
                        {securityQuestions.map((question) => (
                          <option key={question.value} value={question.value}>
                            {question.label}
                          </option>
                        ))}
                      </AuthSelectField>
                      <AuthTextField
                        label="Password"
                        icon={<Lock className="size-4" />}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a strong password"
                        type={showPassword ? 'text' : 'password'}
                        trailing={
                          <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="text-xs font-semibold text-slate-500 dark:text-slate-400"
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        }
                      />
                      <AuthTextField
                        label="Confirm Password"
                        icon={<Lock className="size-4" />}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        trailing={
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            className="text-xs font-semibold text-slate-500 dark:text-slate-400"
                          >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                          </button>
                        }
                      />
                    </div>

                    <AuthTextField
                      label="Security Answer"
                      icon={<KeyRound className="size-4" />}
                      value={securityAnswer}
                      onChange={(event) => setSecurityAnswer(event.target.value)}
                      placeholder="Enter your answer"
                    />

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/35 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(event) => setAcceptTerms(event.target.checked)}
                        className="mt-0.5 size-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <span>
                        I agree to the Terms of Service and Privacy Policy, and I understand secure session handling is enabled.
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => void handleRegister()}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                      Create Account
                      <ArrowRight className="size-4" />
                    </button>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <SocialButton provider="google" onClick={() => void handleSocialAction('google')} loading={socialLoading === 'google'} />
                      <SocialButton provider="apple" onClick={() => void handleSocialAction('apple')} loading={socialLoading === 'apple'} />
                    </div>
                  </div>
                ) : null}

                {view === 'forgot' ? (
                  <div className="space-y-5">
                    {forgotStep === 'identify' ? (
                      <form onSubmit={handleForgotIdentify} className="space-y-5">
                        <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Step 1</p>
                          <p className="mt-2">Enter your registered email or mobile number to begin secure recovery.</p>
                        </div>
                        <AuthTextField
                          label="Email or Mobile"
                          icon={<Mail className="size-4" />}
                          value={forgotIdentifier}
                          onChange={(event) => setForgotIdentifier(event.target.value)}
                          placeholder="name@example.com or 9876543210"
                        />
                        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                          Continue
                          <ArrowRight className="size-4" />
                        </button>
                      </form>
                    ) : (
                      renderForgotStep()
                    )}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-200/70 bg-slate-50/70 px-4 py-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-blue-100 text-[#2563EB] dark:bg-blue-500/10 dark:text-blue-300">
                  <Bus className="size-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Responsive by design</p>
                  <p className="text-xs">Optimized for desktop, tablet, and mobile authentication flows.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentScreen('welcome')}
                className="font-semibold text-[#2563EB] transition hover:text-blue-700"
              >
                Back to Welcome
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default AuthModule;
