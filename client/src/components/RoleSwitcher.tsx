import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Truck, Shield } from "lucide-react";

interface RoleSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <Tabs value={currentRole} onValueChange={onRoleChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/20">
        <TabsTrigger value="passenger" className="flex items-center gap-2" data-testid="tab-role-passenger">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Passenger</span>
        </TabsTrigger>
        <TabsTrigger value="driver" className="flex items-center gap-2" data-testid="tab-role-driver">
          <Truck className="w-4 h-4" />
          <span className="hidden sm:inline">Driver</span>
        </TabsTrigger>
        <TabsTrigger value="admin" className="flex items-center gap-2" data-testid="tab-role-admin">
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
