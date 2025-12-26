import {
  FileText,
  HelpCircle,
  BookOpen,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { ModeToggle } from "../ModeToggle";

interface HeaderProps {
  onBackToHome?: () => void;
  showTabs?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Header({
  onBackToHome,
  showTabs = false,
  activeTab = "summary",
  onTabChange,
}: HeaderProps) {
  const tabs = [
    { id: "summary", label: "Summary", icon: FileText },
    { id: "analysis", label: "Analysis", icon: BarChart3 },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "glossary", label: "Glossary", icon: BookOpen },
    { id: "chat", label: "Ask Questions", icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Glass navbar container with enhanced light theme */}
        <div className="relative bg-white/95 backdrop-blur-xl border border-pink-200 rounded-4xl shadow-xl">
          {/* Light theme glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-purple-50/50 rounded-4xl"></div>

          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between">
              {/* SmartApply AI Logo */}
              <div
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={onBackToHome}
              >
                <div className="h-10 w-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-purple-600 transition-colors">
                  SmartApply AI
                </span>
              </div>

              {/* Tab Navigation - Only show when analysis is complete */}
              {showTabs && (
                <div className="hidden md:flex items-center space-x-1 p-1 bg-gray-50/80 rounded-3xl">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange?.(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 font-medium text-sm ${
                          isActive
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/80"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Light Theme Indicator */}
              <ModeToggle />
            </div>

            {/* Mobile Tab Navigation */}
            {showTabs && (
              <div className="md:hidden mt-4 pt-4 border-t border-pink-200">
                <div className="grid grid-cols-2 gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onTabChange?.(tab.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium text-sm ${
                          isActive
                            ? "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border border-purple-200"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}