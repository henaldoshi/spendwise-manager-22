
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Trash2, 
  Edit, 
  PlusCircle, 
  AlertCircle, 
  BadgeCheck 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransactions, BudgetType } from '@/context/TransactionContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  categoryId: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

const BudgetSettings: React.FC = () => {
  const { budgets, categories, addBudget, editBudget, deleteBudget, getBudgetStatus } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeBudget, setActiveBudget] = useState<BudgetType | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      period: 'monthly',
      categoryId: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
    },
  });
  
  const resetAndCloseDialog = () => {
    form.reset();
    setActiveBudget(null);
    setIsDialogOpen(false);
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (activeBudget) {
        // Edit existing budget
        editBudget({
          ...activeBudget,
          amount: values.amount,
          period: values.period as any,
          categoryId: values.categoryId,
          startDate: new Date(values.startDate).toISOString(),
          endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
        });
        toast.success('Budget updated successfully');
      } else {
        // Add new budget
        addBudget({
          amount: values.amount,
          period: values.period as any,
          categoryId: values.categoryId,
          startDate: new Date(values.startDate).toISOString(),
          endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
        });
        toast.success('Budget created successfully');
      }
      resetAndCloseDialog();
    } catch (error) {
      toast.error('Failed to save budget');
      console.error(error);
    }
  };
  
  const handleEditBudget = (budget: BudgetType) => {
    setActiveBudget(budget);
    form.reset({
      amount: budget.amount,
      period: budget.period,
      categoryId: budget.categoryId,
      startDate: new Date(budget.startDate).toISOString().slice(0, 10),
      endDate: budget.endDate ? new Date(budget.endDate).toISOString().slice(0, 10) : undefined,
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteBudget = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
      toast.success('Budget deleted successfully');
    }
  };
  
  const renderBudgetStatus = (budget: BudgetType) => {
    const { spent, remaining, percentage } = getBudgetStatus(budget.id);
    
    let statusColor = "bg-green-500";
    if (percentage > 80 && percentage < 100) {
      statusColor = "bg-yellow-500";
    } else if (percentage >= 100) {
      statusColor = "bg-red-500";
    }
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Used: ${spent.toFixed(2)}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <Progress value={percentage} className={statusColor} />
        <div className="flex justify-between text-xs">
          <span>Remaining: ${remaining.toFixed(2)}</span>
          <span>Budget: ${budget.amount.toFixed(2)}</span>
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Budget Management</CardTitle>
          <CardDescription>Set and track your spending limits</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="bg-primary/10 hover:bg-primary/20 border-primary/20"
              onClick={() => {
                setActiveBudget(null);
                form.reset({
                  amount: 0,
                  period: 'monthly',
                  categoryId: '',
                  startDate: new Date().toISOString().slice(0, 10),
                  endDate: '',
                });
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4 text-primary" />
              New Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{activeBudget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
              <DialogDescription>
                {activeBudget ? 'Update your budget details below.' : 'Set up a new budget to track your spending.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Total (All Categories)</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                          <Input {...field} type="number" step="0.01" className="pl-7" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={resetAndCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {activeBudget ? 'Update Budget' : 'Create Budget'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-lg border border-dashed">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium text-muted-foreground">No budgets found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-xs">
              Create your first budget to start tracking your spending limits
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(true)}
              className="mt-2"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => {
                  const { percentage } = getBudgetStatus(budget.id);
                  const categoryName = budget.categoryId 
                    ? categories.find(c => c.id === budget.categoryId)?.name 
                    : 'All Categories';
                    
                  return (
                    <TableRow key={budget.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {budget.categoryId ? (
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ 
                                backgroundColor: categories.find(c => c.id === budget.categoryId)?.color || '#888' 
                              }}
                            />
                          ) : (
                            <BadgeCheck className="w-3 h-3 mr-2 text-primary" />
                          )}
                          {categoryName}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {budget.period}
                      </TableCell>
                      <TableCell>${budget.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs inline-flex items-center",
                          percentage > 100 
                            ? "bg-red-100 text-red-800" 
                            : percentage > 80 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-green-100 text-green-800"
                        )}>
                          {percentage > 100 
                            ? "Exceeded" 
                            : percentage > 80 
                              ? "Warning" 
                              : "On Track"}
                        </div>
                        {renderBudgetStatus(budget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditBudget(budget)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDeleteBudget(budget.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetSettings;
