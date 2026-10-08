import { useMemo, useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Droplets,
  Flame,
  LockKeyhole,
  MoonStar,
  Sparkles,
  Target,
  TrendingUp,
  Utensils,
  User,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const getSeedData = () => ({
  user: {
    id: 'u_01',
    name: 'Ariana',
    email: 'ariana@aurafit.app',
    authenticated: true,
    calorieGoal: 2200,
    proteinGoal: 140,
    carbsGoal: 250,
    fatGoal: 70,
    waterGoal: 8,
    activeGoal: 60,
    weightGoal: 62,
  },
  wellness: {
    waterCups: 6,
    totalMinutes: 48,
    caloriesBurned: 510,
    caloriesConsumed: 2010,
    steps: 9100,
  },
  workouts: [
    { id: 1, name: 'HIIT Blast', duration: 28, calories: 240, type: 'Cardio', date: 'Today' },
    { id: 2, name: 'Strength Circuit', duration: 20, calories: 180, type: 'Strength', date: 'Mon' },
  ],
  meals: [
    { id: 1, name: 'Salmon Bowl', calories: 640, carbs: 52, protein: 38, fat: 22, date: 'Today' },
    { id: 2, name: 'Greek Yogurt', calories: 280, carbs: 18, protein: 25, fat: 7, date: 'Today' },
  ],
  weightHistory: [
    { date: 'Jun 02', value: 66.8 },
    { date: 'Jun 10', value: 66.2 },
    { date: 'Jun 17', value: 65.7 },
    { date: 'Jun 24', value: 64.9 },
    { date: 'Jul 01', value: 64.3 },
    { date: 'Jul 08', value: 63.9 },
  ],
  goals: [
    { label: 'Hydration', current: 6, target: 8, unit: 'cups' },
    { label: 'Daily Active', current: 48, target: 60, unit: 'min' },
    { label: 'Protein', current: 63, target: 140, unit: 'g' },
  ],
  coachNote:
    'You are trending in the right direction. Add a post-workout protein source and keep your water intake steady to support recovery.',
});

const defaultCoachResponse =
  'Your recovery trend is strong. Keep your protein intake high, stay hydrated, and prioritize a 20-minute mobility block after your next workout.';

const formatDate = (date) => {
  const options = { month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const calculateMacroTotals = (items) => {
  return items.reduce(
    (totals, item) => {
      totals.carbs += Number(item.carbs || 0);
      totals.protein += Number(item.protein || 0);
      totals.fat += Number(item.fat || 0);
      return totals;
    },
    { carbs: 0, protein: 0, fat: 0 },
  );
};

const getGoalProgress = (current, target) => Math.min((current / target) * 100, 100);

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: 'Ariana', email: 'ariana@aurafit.app', password: 'password123' });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('aura-fit-profile');
    if (!saved) return getSeedData();
    try {
      return JSON.parse(saved);
    } catch {
      return getSeedData();
    }
  });
  const [workoutForm, setWorkoutForm] = useState({ name: 'Sprint Intervals', duration: 30, calories: 280, type: 'Cardio' });
  const [mealForm, setMealForm] = useState({ name: 'Chicken Rice Bowl', calories: 540, carbs: 50, protein: 34, fat: 12 });
  const [weightForm, setWeightForm] = useState({ value: 63.2 });
  const [goalForm, setGoalForm] = useState({
    calorieGoal: profile.user.calorieGoal,
    waterGoal: profile.user.waterGoal,
    activeGoal: profile.user.activeGoal,
    weightGoal: profile.user.weightGoal,
  });
  const [coachPrompt, setCoachPrompt] = useState('');
  const [coachResponse, setCoachResponse] = useState(profile.coachNote || defaultCoachResponse);

  useEffect(() => {
    localStorage.setItem('aura-fit-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    setGoalForm({
      calorieGoal: profile.user.calorieGoal,
      waterGoal: profile.user.waterGoal,
      activeGoal: profile.user.activeGoal,
      weightGoal: profile.user.weightGoal,
    });
  }, [profile]);

  const macroTotals = useMemo(() => calculateMacroTotals(profile.meals), [profile.meals]);

  const calorieBalance = profile.wellness.caloriesConsumed - profile.wellness.caloriesBurned;
  const weeklyTrend = useMemo(() => {
    const trend = profile.weightHistory.map((entry, index) => ({
      name: index === 0 ? 'Week 1' : `W${index + 1}`,
      value: entry.value,
    }));
    return trend;
  }, [profile.weightHistory]);

  const macroChart = [
    { name: 'Carbs', value: macroTotals.carbs },
    { name: 'Protein', value: macroTotals.protein },
    { name: 'Fat', value: macroTotals.fat },
  ];

  const goals = [
    { label: 'Hydration', current: profile.wellness.waterCups, target: profile.user.waterGoal, unit: 'cups' },
    { label: 'Activity', current: profile.wellness.totalMinutes, target: profile.user.activeGoal, unit: 'min' },
    { label: 'Protein', current: macroTotals.protein, target: profile.user.proteinGoal, unit: 'g' },
  ];

  const authSubmit = (event) => {
    event.preventDefault();
    const name = authMode === 'signup' ? authForm.name || 'Athlete' : profile.user.name || 'Athlete';
    const nextProfile = {
      ...getSeedData(),
      user: {
        ...getSeedData().user,
        name,
        email: authForm.email,
        authenticated: true,
      },
      coachNote: defaultCoachResponse,
    };

    setProfile(nextProfile);
    setCoachResponse(defaultCoachResponse);
  };

  const addWorkout = (event) => {
    event.preventDefault();
    setProfile((current) => ({
      ...current,
      workouts: [
        {
          id: Date.now(),
          name: workoutForm.name,
          duration: Number(workoutForm.duration),
          calories: Number(workoutForm.calories),
          type: workoutForm.type,
          date: 'Today',
        },
        ...current.workouts,
      ],
      wellness: {
        ...current.wellness,
        totalMinutes: current.wellness.totalMinutes + Number(workoutForm.duration),
        caloriesBurned: current.wellness.caloriesBurned + Number(workoutForm.calories),
      },
    }));
    setWorkoutForm({ name: '', duration: 30, calories: 200, type: 'Cardio' });
  };

  const addMeal = (event) => {
    event.preventDefault();
    const nextMeal = {
      id: Date.now(),
      name: mealForm.name,
      calories: Number(mealForm.calories),
      carbs: Number(mealForm.carbs),
      protein: Number(mealForm.protein),
      fat: Number(mealForm.fat),
      date: 'Today',
    };

    setProfile((current) => ({
      ...current,
      meals: [nextMeal, ...current.meals],
      wellness: {
        ...current.wellness,
        caloriesConsumed: current.wellness.caloriesConsumed + Number(mealForm.calories),
      },
    }));

    setMealForm({ name: '', calories: 350, carbs: 30, protein: 25, fat: 12 });
  };

  const addWater = (amount = 1) => {
    setProfile((current) => ({
      ...current,
      wellness: {
        ...current.wellness,
        waterCups: current.wellness.waterCups + amount,
      },
    }));
  };

  const saveWeight = (event) => {
    event.preventDefault();
    const value = Number(weightForm.value);
    setProfile((current) => ({
      ...current,
      weightHistory: [
        ...current.weightHistory,
        { date: formatDate(new Date()), value },
      ],
    }));
    setWeightForm({ value: value });
  };

  const saveGoals = (event) => {
    event.preventDefault();
    setProfile((current) => ({
      ...current,
      user: {
        ...current.user,
        calorieGoal: Number(goalForm.calorieGoal),
        waterGoal: Number(goalForm.waterGoal),
        activeGoal: Number(goalForm.activeGoal),
        weightGoal: Number(goalForm.weightGoal),
      },
    }));
  };

  const handleCoachSubmit = (event) => {
    event.preventDefault();
    const prompt = coachPrompt.toLowerCase();
    let response = defaultCoachResponse;

    if (prompt.includes('recovery') || prompt.includes('tired')) {
      response = 'Prioritize a lighter training day, hydrate before and after sessions, and add a magnesium-rich snack to support recovery.';
    } else if (prompt.includes('fat') || prompt.includes('weight')) {
      response = 'Your weight trend is improving. Keep calories in a moderate deficit, maintain protein at 140g, and add two strength sessions this week.';
    } else if (prompt.includes('protein') || prompt.includes('muscle')) {
      response = 'Aiming for 25-35g of protein in each meal will help maximize recovery and lean muscle retention.';
    } else if (prompt.includes('hydration') || prompt.includes('water')) {
      response = 'You are close to your water goal. Pair each workout with a bottle refill and keep sparkling water or electrolyte blends as a backup.';
    }

    setCoachResponse(response);
    setCoachPrompt('');
  };

  const ringStyle = (progress, color = 'rgba(26,209,255,0.9)') => ({
    background: `conic-gradient(${color} ${progress * 3.6}deg, rgba(148,163,184,0.15) 0deg)`,
  });

  if (!profile.user.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="glass w-full max-w-md rounded-3xl p-8 shadow-neon">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-electric-500/20 text-electric-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Welcome to</p>
              <h1 className="text-2xl font-bold text-white">Aura Fit</h1>
            </div>
          </div>

          <div className="mb-5 rounded-2xl bg-slate-900/70 p-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button
                className={`rounded-xl px-4 py-2 ${authMode === 'login' ? 'bg-electric-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                className={`rounded-xl px-4 py-2 ${authMode === 'signup' ? 'bg-electric-500 text-slate-950 font-semibold' : 'text-slate-300'}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>
          </div>

          <form onSubmit={authSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Full Name</span>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-electric-500"
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Email</span>
              <input
                type="email"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-electric-500"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Password</span>
              <input
                type="password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-electric-500"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              />
            </label>

            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-electric-400">
              <LockKeyhole className="h-4 w-4" />
              {authMode === 'login' ? 'Enter Aura Fit' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-500/10 text-electric-400 shadow-neon">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Performance coach</p>
              <h1 className="text-3xl font-black text-white">Aura Fit</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
              <span className="text-slate-400">Member</span> {profile.user.name}
            </div>
            <button
              onClick={() => setProfile((current) => ({ ...current, user: { ...current.user, authenticated: false } }))}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-electric-500 hover:text-electric-300"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="space-y-8">
          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="glass rounded-3xl p-5">
                  <div className="mb-4 flex items-center justify-between text-slate-300">
                    <span className="text-sm uppercase tracking-[0.2em]">Calories</span>
                    <Flame className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-3xl font-black text-white">{Math.abs(calorieBalance)}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">balance</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <p>{profile.wellness.caloriesConsumed} in</p>
                      <p>{profile.wellness.caloriesBurned} out</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-electric-500"
                      style={{ width: `${Math.min((profile.wellness.caloriesConsumed / profile.user.calorieGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="glass rounded-3xl p-5">
                  <div className="mb-4 flex items-center justify-between text-slate-300">
                    <span className="text-sm uppercase tracking-[0.2em]">Active</span>
                    <Activity className="h-5 w-5 text-electric-400" />
                  </div>
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-white">{profile.wellness.totalMinutes}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">min</p>
                    </div>
                    <div className="rounded-full bg-electric-500/10 px-2 py-1 text-xs font-semibold text-electric-300">
                      {Math.round((profile.wellness.totalMinutes / profile.user.activeGoal) * 100)}%
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-electric-500 to-cyan-400"
                      style={{ width: `${Math.min((profile.wellness.totalMinutes / profile.user.activeGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="glass rounded-3xl p-5">
                  <div className="mb-4 flex items-center justify-between text-slate-300">
                    <span className="text-sm uppercase tracking-[0.2em]">Hydration</span>
                    <Droplets className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-white">{profile.wellness.waterCups}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">cups</p>
                    </div>
                    <div className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-300">
                      {Math.round((profile.wellness.waterCups / profile.user.waterGoal) * 100)}%
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${Math.min((profile.wellness.waterCups / profile.user.waterGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="chart-panel rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weight trend</p>
                    <h2 className="text-2xl font-bold text-white">Progress overview</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                    <TrendingUp className="h-4 w-4" />
                    12.8% improvement
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <AreaChart data={weeklyTrend}>
                      <defs>
                        <linearGradient id="weightFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#1ad1ff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#1ad1ff" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#1ad1ff" strokeWidth={3} fill="url(#weightFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="glass rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Daily score</p>
                  <Sparkles className="h-5 w-5 text-electric-400" />
                </div>

                <div className="flex items-center justify-center py-4">
                  <div className="neon-ring relative flex h-36 w-36 items-center justify-center rounded-full" style={ringStyle(82, '#1ad1ff')}>
                    <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-center shadow-inner shadow-electric-500/20">
                      <div>
                        <p className="text-3xl font-black text-white">82</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Score</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2 text-sm">
                    <span className="text-slate-400">Recovery</span>
                    <span className="font-semibold text-emerald-300">Strong</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2 text-sm">
                    <span className="text-slate-400">Focus</span>
                    <span className="font-semibold text-cyan-300">High</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Milestones</p>
                  <Target className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Weight goal', value: `${profile.user.weightGoal}kg`, complete: true },
                    { label: 'Hydration streak', value: '8 days', complete: true },
                    { label: 'Strength target', value: '2 workouts', complete: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-3">
                      <div>
                        <p className="text-sm text-slate-300">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.value}</p>
                      </div>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.complete ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {item.complete ? <CheckCircle2 className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="glass rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workout logger</p>
                    <h2 className="text-2xl font-bold text-white">Log exercise</h2>
                  </div>
                  <Dumbbell className="h-5 w-5 text-electric-400" />
                </div>

                <form className="grid gap-4 md:grid-cols-4" onSubmit={addWorkout}>
                  <label className="md:col-span-2 block">
                    <span className="mb-2 block text-sm text-slate-300">Exercise</span>
                    <input
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={workoutForm.name}
                      onChange={(event) => setWorkoutForm({ ...workoutForm, name: event.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Minutes</span>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={workoutForm.duration}
                      onChange={(event) => setWorkoutForm({ ...workoutForm, duration: event.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Calories</span>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={workoutForm.calories}
                      onChange={(event) => setWorkoutForm({ ...workoutForm, calories: event.target.value })}
                    />
                  </label>
                  <label className="md:col-span-3 block">
                    <span className="mb-2 block text-sm text-slate-300">Type</span>
                    <select
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={workoutForm.type}
                      onChange={(event) => setWorkoutForm({ ...workoutForm, type: event.target.value })}
                    >
                      <option>Cardio</option>
                      <option>Strength</option>
                      <option>Mobility</option>
                      <option>HIIT</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <button className="w-full rounded-2xl bg-electric-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-electric-400">
                      Save workout
                    </button>
                  </div>
                </form>

                <div className="mt-5 space-y-3">
                  {profile.workouts.map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-3">
                      <div>
                        <p className="font-semibold text-white">{workout.name}</p>
                        <p className="text-sm text-slate-400">{workout.type} · {workout.duration} min</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-electric-300">{workout.calories}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">kcal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Diet logger</p>
                    <h2 className="text-2xl font-bold text-white">Food intake</h2>
                  </div>
                  <Utensils className="h-5 w-5 text-orange-400" />
                </div>

                <form className="grid gap-4 md:grid-cols-5" onSubmit={addMeal}>
                  <label className="md:col-span-2 block">
                    <span className="mb-2 block text-sm text-slate-300">Meal</span>
                    <input
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={mealForm.name}
                      onChange={(event) => setMealForm({ ...mealForm, name: event.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Calories</span>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={mealForm.calories}
                      onChange={(event) => setMealForm({ ...mealForm, calories: event.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Carbs</span>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={mealForm.carbs}
                      onChange={(event) => setMealForm({ ...mealForm, carbs: event.target.value })}
                    />
                  </label>
                  <div className="flex items-end">
                    <button className="w-full rounded-2xl bg-orange-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-orange-300">
                      Add meal
                    </button>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Protein</span>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={mealForm.protein}
                      onChange={(event) => setMealForm({ ...mealForm, protein: event.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-300">Fat</span>
                    <input
                      type="number"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                      value={mealForm.fat}
                      onChange={(event) => setMealForm({ ...mealForm, fat: event.target.value })}
                    />
                  </label>
                </form>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {profile.meals.map((meal) => (
                    <div key={meal.id} className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-semibold text-white">{meal.name}</p>
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{meal.date}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs text-slate-300">
                        <div className="rounded-xl bg-slate-800/90 px-2 py-1"><span className="block text-slate-500">Kcal</span>{meal.calories}</div>
                        <div className="rounded-xl bg-slate-800/90 px-2 py-1"><span className="block text-slate-500">Carb</span>{meal.carbs}g</div>
                        <div className="rounded-xl bg-slate-800/90 px-2 py-1"><span className="block text-slate-500">Prot</span>{meal.protein}g</div>
                        <div className="rounded-xl bg-slate-800/90 px-2 py-1"><span className="block text-slate-500">Fat</span>{meal.fat}g</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Macro breakdown</p>
                    <h2 className="text-2xl font-bold text-white">Nutrition split</h2>
                  </div>
                  <Flame className="h-5 w-5 text-amber-400" />
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <BarChart data={macroChart}>
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#1ad1ff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-900/70 p-3 text-center">
                    <p className="text-xl font-black text-white">{macroTotals.carbs}g</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Carbs</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/70 p-3 text-center">
                    <p className="text-xl font-black text-white">{macroTotals.protein}g</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Protein</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/70 p-3 text-center">
                    <p className="text-xl font-black text-white">{macroTotals.fat}g</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Fat</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Water tracker</p>
                    <h2 className="text-2xl font-bold text-white">Daily cups</h2>
                  </div>
                  <Droplets className="h-5 w-5 text-cyan-400" />
                </div>

                <div className="flex items-center justify-center py-5">
                  <div className="neon-ring relative flex h-36 w-36 items-center justify-center rounded-full" style={ringStyle(getGoalProgress(profile.wellness.waterCups, profile.user.waterGoal), '#38bdf8')}>
                    <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-center">
                      <div>
                        <p className="text-3xl font-black text-white">{profile.wellness.waterCups}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">cups</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => addWater(1)} className="flex-1 rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                    + 1 cup
                  </button>
                  <button onClick={() => addWater(2)} className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300">
                    + 2 cups
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="glass rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Smart goals</p>
                  <h2 className="text-2xl font-bold text-white">Personalized targets</h2>
                </div>
                <Target className="h-5 w-5 text-emerald-400" />
              </div>

              <form className="grid gap-4 md:grid-cols-2" onSubmit={saveGoals}>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Calorie goal</span>
                  <input type="number" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500" value={goalForm.calorieGoal} onChange={(event) => setGoalForm({ ...goalForm, calorieGoal: event.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Water goal</span>
                  <input type="number" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500" value={goalForm.waterGoal} onChange={(event) => setGoalForm({ ...goalForm, waterGoal: event.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Active minutes</span>
                  <input type="number" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500" value={goalForm.activeGoal} onChange={(event) => setGoalForm({ ...goalForm, activeGoal: event.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Weight target</span>
                  <input type="number" className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500" value={goalForm.weightGoal} onChange={(event) => setGoalForm({ ...goalForm, weightGoal: event.target.value })} />
                </label>
                <div className="md:col-span-2">
                  <button className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">
                    Save goals
                  </button>
                </div>
              </form>

              <div className="mt-6 space-y-4">
                {goals.map((goal) => {
                  const progress = getGoalProgress(goal.current, goal.target);
                  return (
                    <div key={goal.label}>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span>{goal.label}</span>
                        <span>{goal.current}/{goal.target} {goal.unit}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-800">
                        <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-electric-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI Fitness Coach</p>
                  <h2 className="text-2xl font-bold text-white">Personalized guidance</h2>
                </div>
                <Sparkles className="h-5 w-5 text-electric-400" />
              </div>

              <div className="mb-4 rounded-2xl bg-slate-900/70 p-4 text-sm text-slate-200">
                {coachResponse}
              </div>

              <form onSubmit={handleCoachSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Ask the coach</span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                    placeholder="Ask about recovery, goals, or nutrition..."
                    value={coachPrompt}
                    onChange={(event) => setCoachPrompt(event.target.value)}
                  />
                </label>
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-electric-400">
                  Get advice <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>

          <section className="glass rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weight check-in</p>
                <h2 className="text-2xl font-bold text-white">Update your progress</h2>
              </div>
              <User className="h-5 w-5 text-electric-400" />
            </div>

            <form className="grid gap-4 md:grid-cols-[1fr_auto]" onSubmit={saveWeight}>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Current weight (kg)</span>
                <input
                  type="number"
                  step="0.1"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-electric-500"
                  value={weightForm.value}
                  onChange={(event) => setWeightForm({ value: event.target.value })}
                />
              </label>
              <button className="rounded-2xl bg-electric-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-electric-400">
                Log weight
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
