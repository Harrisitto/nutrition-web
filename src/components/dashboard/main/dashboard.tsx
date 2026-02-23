import { IdxDashboard } from "@src/components/dashboard";
import {
  useConfigSetSidebarOpen,
  useConfigSidebarOpen,
} from "@src/store/slices/config/hook";
import { useAppSelector } from "@src/store/store";
import { useRef } from "react";

const AppDashboard = ({
  children,
  allowShortcuts = true,
}: {
  children?: React.ReactNode;
  allowShortcuts?: boolean;
}) => {
  const sidebarOpen = useConfigSidebarOpen();
  const setSidebarOpen = useConfigSetSidebarOpen();
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleShortcut = useAppSelector((state) => state.config.shortcutConfig.isVisible);
  IdxDashboard.Hooks.useInitalizeShortcuts();
  IdxDashboard.Hooks.useListenerForShortcuts();
  
  return (
    <div
      ref={containerRef}
      className={`h-screen grid grid-cols-[auto_1fr] ${sidebarOpen ? "gap-4" : "gap-0"}`}
    >
      <div
        className={`h-screen bg-gradient-to-b from-dark-green via-dark-green to-nutrition-green shadow-2xl flex flex-col pt-2 pb-2 gap-4 overflow-y-auto transition-all duration-500 ease-in-out ${sidebarOpen ? "w-48 pl-4 pr-4" : "w-16 pl-2 pr-2"}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* ADD SETTINGS ICON */}
        <IdxDashboard.Users.List />
      </div>
      
        {children}
      
      {allowShortcuts && visibleShortcut && <IdxDashboard.AppShortcuts parentRef={containerRef} />}
    </div>
  );
};

export default AppDashboard;
