import React from 'react'
import {
  HammerIcon,
  ZapIcon,
  LayersIcon,
  SproutIcon,
  WrenchIcon,
  ThermometerIcon,
  Paintbrush2Icon as PaintBrushIcon,
  DropletIcon,
  BrickWallFireIcon as WallIcon,
  FanIcon,
  SettingsIcon,
  BrushCleaningIcon as BroomIcon,
  LockIcon,
  ShieldIcon,
  TruckIcon,
  BugIcon,
  SunIcon,
  AppWindowIcon as WindowIcon,
  SquarePowerIcon as SquareIcon,
  HomeIcon,
} from 'lucide-react'

export const CategoryIcons: Record<string, React.FC<{ className?: string }>> = {
  builders: HammerIcon,
  carpenters: HammerIcon,
  electricians: ZapIcon,
  flooring: LayersIcon,
  gardening: SproutIcon,
  handymen: WrenchIcon,
  heating_engineers: ThermometerIcon,
  painters_decorators: PaintBrushIcon,
  plumbers: DropletIcon,
  plasterers_renderers: WallIcon,
  ac_refrigeration: FanIcon,
  appliance_repair: SettingsIcon,
  cleaning: BroomIcon,
  home_security: LockIcon,
  insulation: HomeIcon,
  moving_services: TruckIcon,
  pest_control: BugIcon,
  roofing: SquareIcon /* you may swap for a roofing-specific icon */,
  solar_energy: SunIcon,
  windows_doors: WindowIcon,
  // any placeholder / catch-all codes:
  pagename: HomeIcon,
}

export const DefaultCategoryIcon: React.FC<{ className?: string }> =
  ShieldIcon
