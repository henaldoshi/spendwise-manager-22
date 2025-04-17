
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Camera, Save, User } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('');
  const [currency, setCurrency] = useState('USD');
  
  const handleSaveProfile = () => {
    // In a real app, this would save to a database
    toast.success('Profile updated successfully');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">User Profile</CardTitle>
          <CardDescription>
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">
                  <User size={32} />
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary"
                onClick={() => toast.info('Profile picture upload would be implemented here')}
              >
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
            
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
              <p className="text-xs text-muted-foreground">Member since April 2025</p>
            </div>
          </div>
          
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(Optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Input 
                  id="currency" 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} className="ml-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Account Security</CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              type="password" 
              placeholder="Enter your current password"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => toast.success('Password updated successfully')}
            className="ml-auto"
          >
            Update Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
