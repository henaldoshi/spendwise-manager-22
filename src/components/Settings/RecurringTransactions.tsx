
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTransactions, TransactionType } from '@/context/TransactionContext';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Edit, Trash, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const RecurringTransactions: React.FC = () => {
  const { transactions = [], categories = [], editTransaction, deleteTransaction } = useTransactions();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionType | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [recurringPeriod, setRecurringPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [nextOccurrence, setNextOccurrence] = useState('');

  // Filter recurring transactions - safer with the default value above
  const recurringTransactions = transactions.filter(t => t.isRecurring);

  const handleEditClick = (transaction: TransactionType) => {
    setEditingTransaction(transaction);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setNotes(transaction.notes);
    setRecurringPeriod(transaction.recurringPeriod || 'monthly');
    setNextOccurrence(transaction.nextOccurrence ? new Date(transaction.nextOccurrence).toISOString().substr(0, 10) : '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;

    const updatedTransaction: TransactionType = {
      ...editingTransaction,
      amount: parseFloat(amount),
      category,
      notes,
      recurringPeriod,
      nextOccurrence: nextOccurrence ? new Date(nextOccurrence).toISOString() : editingTransaction.nextOccurrence
    };

    editTransaction(updatedTransaction);
    toast.success("Recurring transaction updated");
    setIsEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this recurring transaction?")) {
      deleteTransaction(id);
      toast.success("Recurring transaction deleted");
    }
  };

  // Helper to get category name from id
  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Recurring Transactions</CardTitle>
        <CardDescription>
          Manage your recurring transactions that are automatically created
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recurringTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recurring transactions. You can create one by checking "Make recurring" when adding a transaction.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {transaction.type === 'income' ? (
                      <span className="flex items-center text-income">
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        Income
                      </span>
                    ) : (
                      <span className="flex items-center text-expense">
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                        Expense
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={transaction.type === 'income' ? 'text-income font-medium' : 'text-expense font-medium'}>
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{getCategoryName(transaction.category)}</TableCell>
                  <TableCell className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {transaction.recurringPeriod ? transaction.recurringPeriod.charAt(0).toUpperCase() + transaction.recurringPeriod.slice(1) : 'Monthly'}
                  </TableCell>
                  <TableCell>
                    {transaction.nextOccurrence ? format(new Date(transaction.nextOccurrence), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{transaction.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(transaction)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Recurring Transaction</DialogTitle>
              <DialogDescription>
                Update the details for this recurring transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select
                  value={recurringPeriod}
                  onValueChange={(value: any) => setRecurringPeriod(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextDate" className="text-right">
                  Next Date
                </Label>
                <Input
                  id="nextDate"
                  type="date"
                  value={nextOccurrence}
                  onChange={(e) => setNextOccurrence(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RecurringTransactions;
