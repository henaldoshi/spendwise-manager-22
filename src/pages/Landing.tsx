
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, BarChart3, PieChart, TrendingUp, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">
              <span className="text-primary">Smart</span>
              <span className="text-smartspend-purple">Spend</span>
            </h1>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">About</Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Log in</Button>
            <Button onClick={() => navigate('/dashboard')}>Sign up</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Take control of your <span className="text-primary">finances</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              SmartSpend helps you track expenses, set budgets, and analyze your spending habits to achieve financial freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => navigate('/dashboard')}>Get Started for Free</Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="glass-card p-6 rounded-lg shadow-lg">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Log In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">Password</label>
                      <Input id="password" type="password" placeholder="Enter your password" />
                    </div>
                    <Button type="submit" className="w-full">Log In</Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <Input id="name" type="text" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                      <Input id="signup-email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                      <Input id="signup-password" type="password" placeholder="Create a password" />
                    </div>
                    <Button type="submit" className="w-full">Sign Up</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Financial Tools</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Designed to simplify your financial management and help you make better decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>
                  Easily log and categorize your expenses in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stay on top of your spending with real-time tracking and automatic categorization.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Budgeting</CardTitle>
                <CardDescription>
                  Create budgets that help you meet your financial goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up custom budgets for different categories and receive alerts when you're close to limits.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Visualize your financial health with interactive charts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gain insights through powerful analytics that help you understand spending patterns.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial habits with SmartSpend.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  "SmartSpend helped me get my finances under control. The budget features are excellent!"
                </p>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Alex Johnson</p>
                    <p className="text-sm text-muted-foreground">Marketing Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  "The analytics features are powerful but easy to use. I love how I can see my spending patterns!"
                </p>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Sarah Miller</p>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  "I've tried many expense trackers but SmartSpend is by far the most intuitive and comprehensive."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">David Chen</p>
                    <p className="text-sm text-muted-foreground">Financial Advisor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card py-12 px-4 sm:px-6 lg:px-8 mt-auto border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-bold">SmartSpend</h2>
              </div>
              <p className="text-muted-foreground">
                Your personal finance assistant to help you manage expenses and achieve financial goals.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="p-0 h-auto">Features</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Pricing</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Testimonials</Button></li>
                <li><Button variant="link" className="p-0 h-auto">FAQ</Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="p-0 h-auto">About</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Blog</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Contact</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Careers</Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="p-0 h-auto">Privacy Policy</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Terms of Service</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Cookie Policy</Button></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SmartSpend. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-4">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </Button>
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Button>
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Button>
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
