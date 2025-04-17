
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions, BudgetType } from '@/context/TransactionContext';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// Form validation schema
const budgetFormSchema = z.object({
  categoryId: z.string(),
  amount: z.coerce.number().positive("Amount must be positive"),
  period: z.enum(["daily", "weekly", "monthly", "yearly"]),
  startDate: z.string(),
  endDate: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

const BudgetSettings: React.FC = () => {
  const { 
    categories = [], 
    budgets = [], 
    addBudget, 
    editBudget, 
    deleteBudget, 
    getBudgetStatus 
  } = useTransactions();
  
  const [editingBudget, setEditingBudget] = useState<BudgetType | null>(null);
  
  // Initialize form with react-hook-form
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: "",
      amount: 0,
      period: "monthly",
      startDate: new Date().toISOString().substring(0, 10),
    },
  });
  
  // Handle form submission
  const onSubmit = (values: BudgetFormValues) => {
    if (editingBudget) {
      // Update existing budget
      editBudget({
        ...editingBudget,
        categoryId: values.categoryId,
        amount: values.amount,
        period: values.period,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined
      });
      toast.success("Budget updated successfully");
    } else {
      // Add new budget
      addBudget({
        categoryId: values.categoryId,
        amount: values.amount,
        period: values.period,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined
      });
      toast.success("Budget added successfully");
    }
    
    // Reset form
    form.reset({
      categoryId: "",
      amount: 0,
      period: "monthly",
      startDate: new Date().toISOString().substring(0, 10),
      endDate: undefined
    });
    setEditingBudget(null);
  };
  
  // Start editing a budget
  const handleEditBudget = (budget: BudgetType) => {
    setEditingBudget(budget);
    
    form.reset({
      categoryId: budget.categoryId,
      amount: budget.amount,
      period: budget.period,
      startDate: new Date(budget.startDate).toISOString().substring(0, 10),
      endDate: budget.endDate ? new Date(budget.endDate).toISOString().substring(0, 10) : undefined
    });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBudget(null);
    form.reset({
      categoryId: "",
      amount: 0,
      period: "monthly",
      startDate: new Date().toISOString().substring(0, 10),
      endDate: undefined
    });
  };
  
  // Delete a budget
  const handleDeleteBudget = (id: string) => {
    deleteBudget(id);
    toast.success("Budget deleted successfully");
    if (editingBudget && editingBudget.id === id) {
      handleCancelEdit();
    }
  };
  
  // Get category name from ID
  const getCategoryName = (id: string) => {
    if (!id) return "Overall Budget";
    const category = categories.find(c => c.id === id);
    return category ? category.name : "Unknown Category";
  };
  
  // Format budget period for display
  const formatPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Budget Management</CardTitle>
          <CardDescription>
            Set and manage your spending budgets by category or overall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Overall Budget</SelectItem>
                        {categories
                          .filter(category => category.id !== '8') // Filter out Income category
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a category or leave empty for overall budget
                    </FormDescription>
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
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                      />
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
                    <FormLabel>Budget Period</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a period" />
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
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                      />
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
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave empty for recurring budget
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                {editingBudget && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit">
                  {editingBudget ? "Update Budget" : "Add Budget"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Current Budgets</CardTitle>
          <CardDescription>
            Track your spending against your budgets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!budgets || budgets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No budgets set. Create your first budget above.
              </div>
            ) : (
              budgets.map((budget) => {
                const { spent, remaining, percentage } = getBudgetStatus(budget.id);
                return (
                  <div key={budget.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {getCategoryName(budget.categoryId)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatPeriod(budget.period)} Budget: ${budget.amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBudget(budget)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${spent.toFixed(2)}</span>
                        <span>Remaining: ${remaining.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={percentage > 100 ? 100 : percentage} 
                        className={`h-2 ${
                          percentage >= 100 
                            ? "bg-destructive" 
                            : percentage >= 80 
                              ? "bg-amber-500" 
                              : ""
                        }`}
                      />
                      {percentage >= 80 && (
                        <div className="flex items-center text-xs mt-1 text-amber-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {percentage >= 100 
                            ? "Budget exceeded!" 
                            : `${percentage.toFixed(0)}% of budget used`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              form.reset({
                categoryId: "",
                amount: 0,
                period: "monthly",
                startDate: new Date().toISOString().substring(0, 10)
              });
              setEditingBudget(null);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Budget
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BudgetSettings;
