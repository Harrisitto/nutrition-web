import { List as SidebarUserList } from "@src/components/dashboard/sideBar/list";
import {
  useConfigSetSidebarOpen,
  useConfigSidebarOpen,
} from "@src/store/slices/config/hook";

const AppDashboard = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const sidebarOpen = useConfigSidebarOpen();
  const setSidebarOpen = useConfigSetSidebarOpen();
  
  return (
    <div
      className={`h-screen grid grid-cols-[auto_1fr] ${sidebarOpen ? "gap-4" : "gap-0"} overflow-hidden`}
    >
      <div
        className={`h-screen bg-gradient-to-b from-dark-green via-dark-green to-nutrition-green shadow-2xl flex flex-col pt-2 pb-2 gap-4 overflow-y-auto transition-all duration-500 ease-in-out ${sidebarOpen ? "w-48 pl-4 pr-4" : "w-16 pl-2 pr-2"}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* ADD SETTINGS ICON */}
        <SidebarUserList />
      </div>
      
      <div className="h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AppDashboard;
