
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ThemeSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    if ((value === 'light' && theme === 'dark') || 
        (value === 'dark' && theme === 'light')) {
      toggleTheme();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Appearance Settings</CardTitle>
        <CardDescription>
          Customize the appearance of your SmartSpend application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme</h3>
          
          <RadioGroup 
            defaultValue={theme} 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            onValueChange={handleThemeChange}
          >
            <div>
              <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-3 h-6 w-6" />
                <div className="text-center space-y-1">
                  <p className="font-medium">Light</p>
                  <p className="text-sm text-muted-foreground">
                    Clean, light appearance
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-3 h-6 w-6" />
                <div className="text-center space-y-1">
                  <p className="font-medium">Dark</p>
                  <p className="text-sm text-muted-foreground">
                    Modern dark mode
                  </p>
                </div>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="system" id="theme-system" className="peer sr-only" disabled />
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground opacity-50 cursor-not-allowed"
              >
                <Monitor className="mb-3 h-6 w-6" />
                <div className="text-center space-y-1">
                  <p className="font-medium">System</p>
                  <p className="text-sm text-muted-foreground">
                    Coming Soon
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">UI Density</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="p-6 h-auto flex flex-col items-center justify-center border-2 border-primary"
            >
              <span className="font-medium mb-1">Comfortable</span>
              <span className="text-xs text-muted-foreground">More spacing</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-6 h-auto flex flex-col items-center justify-center opacity-50"
              disabled
            >
              <span className="font-medium mb-1">Compact</span>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="p-6 h-auto flex flex-col items-center justify-center opacity-50"
              disabled
            >
              <span className="font-medium mb-1">Dense</span>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Animations</h3>
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div>
              <p className="font-medium">Enable Animations</p>
              <p className="text-sm text-muted-foreground">Use animations for smoother transitions</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable-animations"
                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                defaultChecked={true}
              />
              <label htmlFor="enable-animations" className="ml-2 text-sm">Enabled</label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
