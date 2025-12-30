import React, { createContext, useContext, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, LogOut, Filter, Edit2, Trash2, Target, AlertCircle, Moon, Sun, Sparkles, Menu, X, ArrowLeft, Check, BarChart3, Shield, Smartphone, Zap, Globe, Users } from 'lucide-react';

// Theme Context with Dynamic Colors
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [themeColorIndex, setThemeColorIndex] = useState(0);
  
  // Color palettes for automatic rotation
  const colorPalettes = {
    light: [
      { primary: '#10b981', secondary: '#059669', accent: '#34d399', bgFrom: '#f0fdf4', bgVia: '#ffffff', bgTo: '#dcfce7' }, // Green
      { primary: '#3b82f6', secondary: '#2563eb', accent: '#60a5fa', bgFrom: '#eff6ff', bgVia: '#ffffff', bgTo: '#dbeafe' }, // Blue
      { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa', bgFrom: '#faf5ff', bgVia: '#ffffff', bgTo: '#f3e8ff' }, // Purple
      { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6', bgFrom: '#fdf2f8', bgVia: '#ffffff', bgTo: '#fce7f3' }, // Pink
      { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24', bgFrom: '#fffbeb', bgVia: '#ffffff', bgTo: '#fef3c7' }, // Amber
    ],
    dark: [
      { primary: '#10b981', secondary: '#059669', accent: '#34d399', bgFrom: '#064e3b', bgVia: '#0f766e', bgTo: '#134e4a' }, // Green
      { primary: '#3b82f6', secondary: '#2563eb', accent: '#60a5fa', bgFrom: '#1e3a8a', bgVia: '#1e40af', bgTo: '#1e3a8a' }, // Blue
      { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa', bgFrom: '#4c1d95', bgVia: '#5b21b6', bgTo: '#4c1d95' }, // Purple
      { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6', bgFrom: '#831843', bgVia: '#9d174d', bgTo: '#831843' }, // Pink
      { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24', bgFrom: '#78350f', bgVia: '#92400e', bgTo: '#78350f' }, // Amber
    ]
  };

  // Get current color palette
  const getCurrentColors = () => {
    const palette = darkMode ? colorPalettes.dark : colorPalettes.light;
    return palette[themeColorIndex % palette.length];
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
    
    // Load saved color index
    const savedColorIndex = localStorage.getItem('themeColorIndex');
    if (savedColorIndex) {
      setThemeColorIndex(parseInt(savedColorIndex));
    }
  }, []);

  // Function to automatically rotate theme colors
  const rotateThemeColors = () => {
    const palette = darkMode ? colorPalettes.dark : colorPalettes.light;
    const newIndex = (themeColorIndex + 1) % palette.length;
    setThemeColorIndex(newIndex);
    localStorage.setItem('themeColorIndex', newIndex.toString());
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Automatically rotate theme colors every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      rotateThemeColors();
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [darkMode, themeColorIndex]);

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleTheme, 
      themeColors: getCurrentColors(),
      rotateThemeColors 
    }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem('currentUser');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = { email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      return false;
    }
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Data Context
const DataContext = createContext();

const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});

  useEffect(() => {
    if (user) {
      const userKey = user.email;
      const savedIncomes = JSON.parse(localStorage.getItem(`incomes_${userKey}`) || '[]');
      const savedExpenses = JSON.parse(localStorage.getItem(`expenses_${userKey}`) || '[]');
      const savedBudgets = JSON.parse(localStorage.getItem(`budgets_${userKey}`) || '{}');
      setIncomes(savedIncomes);
      setExpenses(savedExpenses);
      setBudgets(savedBudgets);
    }
  }, [user]);

  const saveToLocalStorage = (key, data) => {
    if (user) {
      localStorage.setItem(`${key}_${user.email}`, JSON.stringify(data));
    }
  };

  const addIncome = (income) => {
    const newIncome = { ...income, id: Date.now() };
    const updated = [...incomes, newIncome];
    setIncomes(updated);
    saveToLocalStorage('incomes', updated);
  };

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now() };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    saveToLocalStorage('expenses', updated);
  };

  const updateExpense = (id, updatedExpense) => {
    const updated = expenses.map(exp => exp.id === id ? { ...updatedExpense, id } : exp);
    setExpenses(updated);
    saveToLocalStorage('expenses', updated);
  };

  const deleteExpense = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    saveToLocalStorage('expenses', updated);
  };

  const setBudget = (category, amount) => {
    const updated = { ...budgets, [category]: amount };
    setBudgets(updated);
    saveToLocalStorage('budgets', updated);
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    <DataContext.Provider value={{
      incomes, expenses, budgets, totalIncome, totalExpense, balance,
      addIncome, addExpense, updateExpense, deleteExpense, setBudget
    }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => useContext(DataContext);

// Home Page
const HomePage = () => {
  const { darkMode, toggleTheme, themeColors } = useTheme();
  const [sparkles, setSparkles] = useState([]);

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  // Generate sparkles animation
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 20; i++) {
        newSparkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 2
        });
      }
      setSparkles(newSparkles);
    };
    generateSparkles();
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500`}
      style={{
        background: darkMode 
          ? `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
          : `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
      }}>
      {/* Sparkles Animation */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animation: `sparkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`
          }}
        >
          <Sparkles className={`w-4 h-4 opacity-60`} style={{ color: themeColors.accent }} />
        </div>
      ))}

      <style>{`
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0) rotate(0deg);
          }
          50% { 
            opacity: 1; 
            transform: scale(1) rotate(180deg);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px ${themeColors.primary}30; }
          50% { box-shadow: 0 0 40px ${themeColors.primary}60; }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          transition: transform 0.3s ease;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <nav className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <div className="flex items-center space-x-3 float-animation">
            <div className={`p-2 rounded-xl glow-effect`} style={{ backgroundColor: themeColors.primary }}>
              <Wallet className="text-white w-8 h-8" />
            </div>
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ExpenseFlow
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 hover:scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => navigate('login')} 
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => navigate('signup')} 
              className="px-6 py-3 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
            >
              Sign Up
            </button>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 float-animation">
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Take Control of Your{' '}
              <span className="relative inline-block">
                <span style={{ color: themeColors.primary }}>Finances</span>
                <span className="absolute bottom-0 left-0 w-full h-2 opacity-30 blur-sm"
                  style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.accent})` }}>
                </span>
              </span>
            </h1>
            <p className={`text-lg md:text-xl lg:text-2xl mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Track expenses, manage income, and achieve your financial goals
            </p>
            <p className={`text-base md:text-lg ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              with ExpenseFlow's powerful yet simple tools
            </p>
          </div>

          {/* Mobile और Desktop दोनों के लिए बटन */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-20">
            <button 
              onClick={() => navigate('signup')} 
              className="px-6 py-4 md:px-10 md:py-5 text-white text-base md:text-lg font-semibold rounded-xl hover:scale-105 transition-all shadow-2xl transform glow-effect"
              style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('features')} 
              className={`px-6 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold rounded-xl transition-all shadow-lg transform hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              Explore Features
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Track Income Box */}
            <div className={`p-6 md:p-8 transition-all duration-500 hover:rounded-[50%] rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl ${
              darkMode ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm' : 'bg-white'
            }`}>
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-transform ${
                darkMode ? '' : 'bg-green-100'
              }`} style={{ backgroundColor: darkMode ? themeColors.primary : undefined }}>
                <TrendingUp className={`w-8 h-8 md:w-10 md:h-10 ${darkMode ? 'text-white' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Track Income
              </h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Monitor all your income sources in one centralized dashboard
              </p>
            </div>

            {/* Manage Expenses Box */}
            <div className={`p-6 md:p-8 transition-all duration-500 hover:rounded-[50%] rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl ${
              darkMode ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm' : 'bg-white'
            }`}>
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-transform ${
                darkMode ? '' : 'bg-red-100'
              }`} style={{ backgroundColor: darkMode ? themeColors.secondary : undefined }}>
                <TrendingDown className={`w-8 h-8 md:w-10 md:h-10 ${darkMode ? 'text-white' : 'text-red-600'}`} />
              </div>
              <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Manage Expenses
              </h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Categorize and track every expense with detailed insights
              </p>
            </div>

            {/* Set Budgets Box */}
            <div className={`p-6 md:p-8 transition-all duration-500 hover:rounded-[50%] rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl ${
              darkMode ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm' : 'bg-white'
            }`}>
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-transform ${
                darkMode ? '' : 'bg-blue-100'
              }`} style={{ backgroundColor: darkMode ? themeColors.accent : undefined }}>
                <Target className={`w-8 h-8 md:w-10 md:h-10 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-xl md:text-2xl font-bold mb-2 md:mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Set Budgets
              </h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Plan your spending with smart category-based budgets
              </p>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="mt-20 grid md:grid-cols-2 gap-8">
            <div className={`p-6 md:p-8 rounded-2xl shadow-lg text-left ${
              darkMode ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm' : 'bg-white'
            }`}>
              <Sparkles className="w-10 h-10 md:w-12 md:h-12 mb-4" style={{ color: themeColors.primary }} />
              <h4 className={`text-lg md:text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Beautiful Analytics
              </h4>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Visualize your financial data with stunning charts and graphs
              </p>
            </div>

            <div className={`p-6 md:p-8 rounded-2xl shadow-lg text-left ${
              darkMode ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm' : 'bg-white'
            }`}>
              <DollarSign className="w-10 h-10 md:w-12 md:h-12 mb-4" style={{ color: themeColors.primary }} />
              <h4 className={`text-lg md:text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Smart Insights
              </h4>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get intelligent recommendations to improve your financial health
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Page
const FeaturesPage = () => {
  const { darkMode, toggleTheme, themeColors } = useTheme();

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Visualize your spending patterns with interactive charts and graphs. Track trends over time and make data-driven decisions.",
      color: themeColors.primary
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Budgeting",
      description: "Set budgets for different categories and get alerts when you're approaching your limits. Achieve your financial goals faster.",
      color: themeColors.secondary
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-Level Security",
      description: "Your financial data is encrypted and stored securely. We never share your information with third parties.",
      color: "#8b5cf6"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Friendly",
      description: "Access your finances on any device. Our responsive design works perfectly on desktop, tablet, and mobile.",
      color: "#ec4899"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Sync",
      description: "Your data syncs instantly across all devices. Add expenses on your phone, view reports on your laptop.",
      color: "#f59e0b"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-currency",
      description: "Track expenses in multiple currencies with automatic exchange rates. Perfect for travelers and international users.",
      color: "#3b82f6"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Sharing",
      description: "Share budgets and track expenses with family members. Perfect for managing household finances together.",
      color: "#10b981"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Investment Tracking",
      description: "Monitor your investments alongside expenses. Get a complete picture of your financial health.",
      color: "#db2777"
    }
  ];

  const benefits = [
    "Save up to 20% more each month",
    "Reduce financial stress by 40%",
    "Achieve financial goals 3x faster",
    "Get personalized spending insights",
    "24/7 access to your financial data",
    "No credit card required to start"
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500`}
      style={{
        background: darkMode 
          ? `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
          : `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
      }}>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button - Centered और Attractive */}
        <div className="flex justify-center mb-8 md:mb-12">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            style={{ 
              background: darkMode 
                ? `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`
                : '#ffffff',
              border: darkMode ? 'none' : '2px solid ' + themeColors.primary + '20'
            }}
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
              style={{ color: darkMode ? '#ffffff' : themeColors.primary }} />
            <span className="font-medium" style={{ color: darkMode ? '#ffffff' : themeColors.primary }}>
              Back to Home
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: darkMode ? '#ffffff' : themeColors.primary }}
            />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            All Features of <span className="relative inline-block">
              <span style={{ color: themeColors.primary }}>ExpenseFlow</span>
              <span className="absolute bottom-0 left-0 w-full h-2 opacity-30 blur-sm"
                style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.accent})` }}>
              </span>
            </span>
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Discover everything you need to take complete control of your finances
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card group relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}
              style={{ 
                borderTop: `4px solid ${feature.color}`,
                borderLeft: `2px solid ${feature.color}20`,
                borderRight: `2px solid ${feature.color}20`,
                borderBottom: `2px solid ${feature.color}20`
              }}
            >
              {/* Background Animation */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ 
                  background: `radial-gradient(circle at center, ${feature.color}10 0%, transparent 70%)`
                }}
              />
              
              {/* Icon with Title */}
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div 
                  className="flex-shrink-0 p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{ 
                    backgroundColor: `${feature.color}20`,
                    boxShadow: `0 4px 20px ${feature.color}40`
                  }}
                >
                  <div style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-bold pt-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {feature.title}
                </h3>
              </div>
              
              {/* Description */}
              <p className={`text-sm relative z-10 transition-all duration-300 group-hover:translate-y-1 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
              
              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{ backgroundColor: feature.color }}
              />
            </div>
          ))}
        </div>

        {/* Benefits Section - Enhanced */}
        <div className={`p-8 md:p-12 rounded-2xl shadow-lg mb-16 relative overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5"
            style={{ background: `radial-gradient(circle, ${themeColors.primary} 0%, transparent 70%)` }}
          />
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center relative z-10 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            What You'll <span style={{ color: themeColors.primary }}>Achieve</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-white'
                }`}
              >
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                  style={{ 
                    backgroundColor: `${themeColors.primary}20`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <Check className="w-4 h-4" style={{ color: themeColors.primary }} />
                </div>
                <div className="flex-1">
                  <p className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {benefit}
                  </p>
                  <div 
                    className="mt-2 h-1 rounded-full transition-all duration-500"
                    style={{ 
                      width: '0%',
                      backgroundColor: themeColors.primary
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.width = '100%'}
                    onMouseLeave={(e) => e.currentTarget.style.width = '0%'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - "Learn More" Button Removed */}
        <div className="text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Ready to Transform Your <span style={{ color: themeColors.primary }}>Finances</span>?
          </h2>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of users who have taken control of their financial future
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('signup')}
              className="px-8 py-4 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-all shadow-xl hover:shadow-2xl transform group relative overflow-hidden"
              style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const { darkMode, toggleTheme, themeColors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500`}
      style={{
        background: darkMode 
          ? `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
          : `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
      }}>
      <div className={`p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full transition-all ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          {/* Attractive Back to Home Button */}
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            style={{ 
              background: darkMode 
                ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                : '#f3f4f6',
              border: `2px solid ${themeColors.primary}30`
            }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
              style={{ color: themeColors.primary }} />
            <span className="text-sm font-medium" style={{ color: themeColors.primary }}>
              Back to Home
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: themeColors.primary }}
            />
          </button>
          
          <div className="flex items-center justify-center flex-1">
            <div className={`p-3 rounded-xl ${darkMode ? '' : 'bg-green-100'}`} style={{ backgroundColor: darkMode ? themeColors.primary : undefined }}>
              <Wallet className={`w-8 h-8 md:w-10 md:h-10 ${darkMode ? 'text-white' : 'text-green-600'}`} />
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleTheme}
              className={`p-2 md:p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </div>
        </div>
        <h2 className={`text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Welcome Back
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:border-transparent transition ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
              style={{ '--tw-ring-color': themeColors.primary }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:border-transparent transition ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
              style={{ '--tw-ring-color': themeColors.primary }}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full text-white py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-[1.02] group relative overflow-hidden"
            style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </form>
        
        <p className={`text-center mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('signup')} 
            className={`font-semibold transition-colors`}
            style={{ color: themeColors.primary }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

// Signup Page
const SignupPage = () => {
  const { darkMode, toggleTheme, themeColors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signup(name, email, password)) {
      setSuccess(true);
      setTimeout(() => navigate('login'), 2000);
    } else {
      setError('Email already exists');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500`}
      style={{
        background: darkMode 
          ? `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
          : `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
      }}>
      <div className={`p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full transition-all ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          {/* Attractive Back to Home Button */}
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden"
            style={{ 
              background: darkMode 
                ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                : '#f3f4f6',
              border: `2px solid ${themeColors.primary}30`
            }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
              style={{ color: themeColors.primary }} />
            <span className="text-sm font-medium" style={{ color: themeColors.primary }}>
              Back to Home
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: themeColors.primary }}
            />
          </button>
          
          <div className="flex items-center justify-center flex-1">
            <div className={`p-3 rounded-xl ${darkMode ? '' : 'bg-green-100'}`} style={{ backgroundColor: darkMode ? themeColors.primary : undefined }}>
              <Wallet className={`w-8 h-8 md:w-10 md:h-10 ${darkMode ? 'text-white' : 'text-green-600'}`} />
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleTheme}
              className={`p-2 md:p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </div>
        </div>
        <h2 className={`text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Create Account
        </h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <span>✓</span>
            Account created! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:border-transparent transition ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
              style={{ '--tw-ring-color': themeColors.primary }}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:border-transparent transition ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
              style={{ '--tw-ring-color': themeColors.primary }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:border-transparent transition ${
                darkMode 
                  ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
              style={{ '--tw-ring-color': themeColors.primary }}
              placeholder="Create a password (min 6 characters)"
              required
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full text-white py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-[1.02] group relative overflow-hidden"
            style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </form>
        
        <p className={`text-center mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <button 
            onClick={() => navigate('login')} 
            className={`font-semibold transition-colors`}
            style={{ color: themeColors.primary }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { totalIncome, totalExpense, balance, expenses } = useData();
  const { darkMode, toggleTheme, themeColors } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    setMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  // Calculate category-wise expenses for pie chart
  const categoryData = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if (existing) {
      existing.value += parseFloat(exp.amount);
    } else {
      acc.push({ name: exp.category, value: parseFloat(exp.amount) });
    }
    return acc;
  }, []);

  // Calculate monthly expenses for bar chart
  const monthlyData = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += parseFloat(exp.amount);
    } else {
      acc.push({ month, amount: parseFloat(exp.amount) });
    }
    return acc;
  }, []);

  const COLORS = [themeColors.primary, themeColors.secondary, themeColors.accent, '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
    }}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Wallet className="w-8 h-8" style={{ color: themeColors.primary }} />
              <span className="text-2xl font-bold text-gray-800">ExpenseFlow</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button onClick={handleLogout} className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                  
                  {/* Theme Toggle Button for Mobile */}
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                
                <button onClick={handleLogout} className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition w-full py-2">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Main Navigation Tabs */}
        <div className="relative mb-8">
          {/* Mobile Navigation Scroll Container */}
          <div className="flex space-x-2 mb-4 md:hidden overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${activeTab === 'overview' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              style={{ backgroundColor: activeTab === 'overview' ? themeColors.primary : undefined }}
            >
              Overview
            </button>
            <button
              onClick={() => navigate('add-income')}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
            >
              Add Income
            </button>
            <button
              onClick={() => navigate('add-expense')}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
            >
              Add Expense
            </button>
            <button
              onClick={() => navigate('expense-history')}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
            >
              History
            </button>
            <button
              onClick={() => navigate('budget-planner')}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
            >
              Budget
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-lg transition ${activeTab === 'overview' ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              style={{ backgroundColor: activeTab === 'overview' ? themeColors.primary : undefined }}
            >
              Overview
            </button>
            <button
              onClick={() => navigate('add-income')}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Add Income
            </button>
            <button
              onClick={() => navigate('add-expense')}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Add Expense
            </button>
            <button
              onClick={() => navigate('expense-history')}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              History
            </button>
            <button
              onClick={() => navigate('budget-planner')}
              className="px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Budget Planner
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium text-sm md:text-base">Total Income</h3>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" style={{ color: themeColors.primary }} />
            </div>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: themeColors.primary }}>₹{totalIncome.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium text-sm md:text-base">Total Expenses</h3>
              <TrendingDown className="text-red-600 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-red-600">₹{totalExpense.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium text-sm md:text-base">Balance</h3>
              <DollarSign className={`w-5 h-5 md:w-6 md:h-6 ${balance >= 0 ? '' : 'text-red-600'}`} 
                style={{ color: balance >= 0 ? themeColors.primary : undefined }} />
            </div>
            <p className={`text-2xl md:text-3xl font-bold ${balance >= 0 ? '' : 'text-red-600'}`}
              style={{ color: balance >= 0 ? themeColors.primary : undefined }}>
              ₹{balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Expense by Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="text-xs md:text-sm">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-16 md:py-20">No expense data available</p>
            )}
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Monthly Expenses</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="text-xs md:text-sm">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill={themeColors.primary} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-16 md:py-20">No expense data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Income Page
const AddIncomePage = () => {
  const { themeColors, darkMode, toggleTheme } = useTheme();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [success, setSuccess] = useState(false);
  const { addIncome } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    setMobileMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addIncome({ amount, source, date });
    setSuccess(true);
    setAmount('');
    setSource('');
    setTimeout(() => {
      setSuccess(false);
      navigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
    }}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('dashboard')} className="flex items-center space-x-2 text-gray-700 hover:text-green-600">
              <Wallet className="w-8 h-8" style={{ color: themeColors.primary }} />
              <span className="text-2xl font-bold text-gray-800">ExpenseFlow</span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Attractive Back to Dashboard Button */}
              <button 
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                style={{ 
                  background: darkMode 
                    ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                    : '#f3f4f6',
                  border: `2px solid ${themeColors.primary}30`
                }}
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                  style={{ color: themeColors.primary }} />
                <span className="font-medium" style={{ color: themeColors.primary }}>
                  Back to Dashboard
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: themeColors.primary }}
                />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Actions</span>
                  
                  {/* Theme Toggle Button for Mobile */}
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Mobile के लिए Attractive Back to Dashboard Button */}
                <button 
                  onClick={() => navigate('dashboard')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden w-full"
                  style={{ 
                    background: darkMode 
                      ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                      : '#f3f4f6',
                    border: `2px solid ${themeColors.primary}30`
                  }}
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                    style={{ color: themeColors.primary }} />
                  <span style={{ color: themeColors.primary }}>Back to Dashboard</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: themeColors.primary }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Add Income</h2>
          
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center space-x-2">
              <span>✓</span>
              <span>Income added successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': themeColors.primary }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., Salary, Freelance, Investment"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': themeColors.primary }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': themeColors.primary }}
                required
              />
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <button type="submit" className="flex-1 text-white py-3 rounded-lg transition shadow-md group relative overflow-hidden"
                style={{ backgroundColor: themeColors.primary }}>
                <span className="relative z-10">Add Income</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </button>
              <button 
                type="button" 
                onClick={() => navigate('dashboard')} 
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="relative z-10">Back to Dashboard</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: themeColors.primary }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add Expense Page
const AddExpensePage = () => {
  const { themeColors, darkMode, toggleTheme } = useTheme();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [success, setSuccess] = useState(false);
  const { addExpense } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Custom'];

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    setMobileMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCategory = category === 'Custom' ? customCategory : category;
    
    if (!selectedCategory.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    addExpense({ amount, category: selectedCategory, note, date });
    setSuccess(true);
    setAmount('');
    setCategory('Food');
    setCustomCategory('');
    setNote('');
    setTimeout(() => {
      setSuccess(false);
      navigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
    }}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('dashboard')} className="flex items-center space-x-2 text-gray-700 hover:text-green-600">
              <Wallet className="w-8 h-8" style={{ color: themeColors.primary }} />
              <span className="text-2xl font-bold text-gray-800">ExpenseFlow</span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Attractive Back to Dashboard Button */}
              <button 
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                style={{ 
                  background: darkMode 
                    ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                    : '#f3f4f6',
                  border: `2px solid ${themeColors.primary}30`
                }}
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                  style={{ color: themeColors.primary }} />
                <span className="font-medium" style={{ color: themeColors.primary }}>
                  Back to Dashboard
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: themeColors.primary }}
                />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Actions</span>
                  
                  {/* Theme Toggle Button for Mobile */}
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Mobile के लिए Attractive Back to Dashboard Button */}
                <button 
                  onClick={() => navigate('dashboard')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden w-full"
                  style={{ 
                    background: darkMode 
                      ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                      : '#f3f4f6',
                    border: `2px solid ${themeColors.primary}30`
                  }}
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                    style={{ color: themeColors.primary }} />
                  <span style={{ color: themeColors.primary }}>Back to Dashboard</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: themeColors.primary }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Add Expense</h2>
          
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center space-x-2">
              <span>✓</span>
              <span>Expense added successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': themeColors.primary }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': themeColors.primary }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              {category === 'Custom' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Type any category name..."
                  className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': themeColors.primary }}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': themeColors.primary }}
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': themeColors.primary }}
                required
              />
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition shadow-md group relative overflow-hidden">
                <span className="relative z-10">Add Expense</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </button>
              <button 
                type="button" 
                onClick={() => navigate('dashboard')} 
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="relative z-10">Back to Dashboard</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: themeColors.primary }}
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Expense History Page
const ExpenseHistoryPage = () => {
  const { themeColors, darkMode, toggleTheme } = useTheme();
  const { expenses, deleteExpense, updateExpense } = useData();
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['All', 'Food', 'Travel', 'Rent', 'Shopping', 'Bills'];
  
  // Extract unique categories from expenses (including custom ones)
  const uniqueCategories = [...new Set(expenses.map(exp => exp.category))].filter(cat => !categories.includes(cat));
  const allCategories = [...categories, ...uniqueCategories];

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    setMobileMenuOpen(false);
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm(expense);
  };

  const saveEdit = () => {
    updateExpense(editingId, editForm);
    setEditingId(null);
  };

  const filteredExpenses = expenses
    .filter(exp => filterCategory === 'All' || exp.category === filterCategory)
    .filter(exp => !filterDate || exp.date === filterDate)
    .sort((a, b) => {
      if (sortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      return 0;
    });

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
    }}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('dashboard')} className="flex items-center space-x-2 text-gray-700 hover:text-green-600">
              <Wallet className="w-8 h-8" style={{ color: themeColors.primary }} />
              <span className="text-2xl font-bold text-gray-800">ExpenseFlow</span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Attractive Back to Dashboard Button */}
              <button 
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                style={{ 
                  background: darkMode 
                    ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                    : '#f3f4f6',
                  border: `2px solid ${themeColors.primary}30`
                }}
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                  style={{ color: themeColors.primary }} />
                <span className="font-medium" style={{ color: themeColors.primary }}>
                  Back to Dashboard
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: themeColors.primary }}
                />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Actions</span>
                  
                  {/* Theme Toggle Button for Mobile */}
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Mobile के लिए Attractive Back to Dashboard Button */}
                <button 
                  onClick={() => navigate('dashboard')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden w-full"
                  style={{ 
                    background: darkMode 
                      ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                      : '#f3f4f6',
                    border: `2px solid ${themeColors.primary}30`
                  }}
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                    style={{ color: themeColors.primary }} />
                  <span style={{ color: themeColors.primary }}>Back to Dashboard</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: themeColors.primary }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Expense History</h2>

        {/* Filters */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                style={{ '--tw-ring-color': themeColors.primary }}
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                style={{ '--tw-ring-color': themeColors.primary }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                style={{ '--tw-ring-color': themeColors.primary }}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-md text-center">
              <p className="text-gray-500 text-lg">No expenses found</p>
            </div>
          ) : (
            filteredExpenses.map(expense => (
              <div key={expense.id} className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition">
                {editingId === expense.id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                        style={{ '--tw-ring-color': themeColors.primary }}
                      />
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                        style={{ '--tw-ring-color': themeColors.primary }}
                        placeholder="Category"
                      />
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                        style={{ '--tw-ring-color': themeColors.primary }}
                      />
                    </div>
                    <textarea
                      value={editForm.note}
                      onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm md:text-base"
                      style={{ '--tw-ring-color': themeColors.primary }}
                      rows="2"
                    />
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                      <button onClick={saveEdit} className="px-4 py-2 text-white rounded-lg hover:bg-green-700 text-sm md:text-base group relative overflow-hidden"
                        style={{ backgroundColor: themeColors.primary }}>
                        <span className="relative z-10">Save</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm md:text-base">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-2">
                        <span className="text-xl md:text-2xl font-bold text-red-600">₹{parseFloat(expense.amount).toFixed(2)}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-medium self-start">
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1 text-sm md:text-base">{expense.note}</p>
                      <p className="text-xs md:text-sm text-gray-500">{new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => startEdit(expense)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button onClick={() => deleteExpense(expense.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Budget Planner Page
const BudgetPlannerPage = () => {
  const { themeColors, darkMode, toggleTheme } = useTheme();
  const { budgets, setBudget, expenses } = useData();
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills'];
  
  // Extract unique categories from expenses (including custom ones)
  const uniqueCategories = [...new Set(expenses.map(exp => exp.category))].filter(cat => !categories.includes(cat));
  const allCategories = [...categories, ...uniqueCategories];

  const navigate = (page) => {
    document.dispatchEvent(new CustomEvent('navigate', { detail: page }));
    setMobileMenuOpen(false);
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setBudgetAmount(budgets[category] || '');
  };

  const saveBudget = () => {
    if (budgetAmount && parseFloat(budgetAmount) > 0) {
      setBudget(editingCategory, parseFloat(budgetAmount));
    }
    setEditingCategory(null);
    setBudgetAmount('');
  };

  const getCategoryExpense = (category) => {
    return expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  };

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, ${themeColors.bgFrom}, ${themeColors.bgVia}, ${themeColors.bgTo})`
    }}>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('dashboard')} className="flex items-center space-x-2 text-gray-700 hover:text-green-600">
              <Wallet className="w-8 h-8" style={{ color: themeColors.primary }} />
              <span className="text-2xl font-bold text-gray-800">ExpenseFlow</span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Attractive Back to Dashboard Button */}
              <button 
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                style={{ 
                  background: darkMode 
                    ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                    : '#f3f4f6',
                  border: `2px solid ${themeColors.primary}30`
                }}
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                  style={{ color: themeColors.primary }} />
                <span className="font-medium" style={{ color: themeColors.primary }}>
                  Back to Dashboard
                </span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: themeColors.primary }}
                />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Actions</span>
                  
                  {/* Theme Toggle Button for Mobile */}
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Mobile के लिए Attractive Back to Dashboard Button */}
                <button 
                  onClick={() => navigate('dashboard')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden w-full"
                  style={{ 
                    background: darkMode 
                      ? `linear-gradient(to right, ${themeColors.primary}20, ${themeColors.secondary}20)`
                      : '#f3f4f6',
                    border: `2px solid ${themeColors.primary}30`
                  }}
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                    style={{ color: themeColors.primary }} />
                  <span style={{ color: themeColors.primary }}>Back to Dashboard</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: themeColors.primary }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Budget Planner</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allCategories.map(category => {
            const budget = budgets[category] || 0;
            const spent = getCategoryExpense(category);
            const remaining = budget - spent;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const isOverBudget = spent > budget && budget > 0;

            return (
              <div key={category} className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{category}</h3>
                  {editingCategory === category ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        placeholder="Budget"
                        className="w-20 md:w-24 px-2 py-1 border border-gray-300 rounded text-xs md:text-sm focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': themeColors.primary }}
                      />
                      <button onClick={saveBudget} className="px-2 py-1 text-white rounded text-xs md:text-sm hover:bg-green-700 group relative overflow-hidden"
                        style={{ backgroundColor: themeColors.primary }}>
                        <span className="relative z-10">Save</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      </button>
                      <button onClick={() => setEditingCategory(null)} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs md:text-sm hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(category)} className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium">
                      {budget > 0 ? 'Edit' : 'Set'}
                    </button>
                  )}
                </div>

                {budget > 0 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium" style={{ color: themeColors.primary }}>₹{budget.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Spent:</span>
                        <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
                          ₹{spent.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Remaining:</span>
                        <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{remaining.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                        <div
                          className={`h-2 md:h-3 rounded-full transition-all ${
                            percentage >= 100 ? 'bg-red-600' : percentage >= 75 ? 'bg-yellow-500' : ''
                          }`}
                          style={{ 
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: percentage < 75 ? themeColors.primary : undefined
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% used</p>
                    </div>

                    {/* Warning */}
                    {isOverBudget && (
                      <div className="flex items-center space-x-2 text-red-600 text-xs md:text-sm mt-3">
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Budget exceeded!</span>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-xs md:text-sm">No budget set for this category</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleNavigate = (e) => {
      setCurrentPage(e.detail);
    };
    document.addEventListener('navigate', handleNavigate);
    return () => document.removeEventListener('navigate', handleNavigate);
  }, []);

  const { user } = useAuth();

  // Redirect to dashboard if logged in and on auth pages
  useEffect(() => {
    if (user && (currentPage === 'home' || currentPage === 'login' || currentPage === 'signup' || currentPage === 'features')) {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  // Protect dashboard routes
  const protectedPages = ['dashboard', 'add-income', 'add-expense', 'expense-history', 'budget-planner'];
  if (!user && protectedPages.includes(currentPage)) {
    return <LoginPage />;
  }

  const pages = {
    home: <HomePage />,
    features: <FeaturesPage />,
    login: <LoginPage />,
    signup: <SignupPage />,
    dashboard: <Dashboard />,
    'add-income': <AddIncomePage />,
    'add-expense': <AddExpensePage />,
    'expense-history': <ExpenseHistoryPage />,
    'budget-planner': <BudgetPlannerPage />
  };

  return pages[currentPage] || <HomePage />;
};

// Root Component
const Root = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Root;