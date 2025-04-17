
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactions, CategoryType } from '@/context/TransactionContext';
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash, Check, X } from 'lucide-react';
import { toast } from "sonner";

const CategorySettings: React.FC = () => {
  const { categories, addCategory, editCategory, deleteCategory } = useTransactions();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3B82F6');
  const [newIcon, setNewIcon] = useState('folder');

  const handleAddSubmit = () => {
    if (!newName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    addCategory({
      name: newName,
      color: newColor,
      icon: newIcon
    });
    
    toast.success("Category added successfully");
    resetForm();
  };
  
  const handleEditSubmit = (id: string) => {
    if (!newName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    editCategory({
      id,
      name: newName,
      color: newColor,
      icon: newIcon
    });
    
    toast.success("Category updated successfully");
    resetForm();
  };
  
  const handleStartEdit = (category: CategoryType) => {
    setEditingId(category.id);
    setNewName(category.name);
    setNewColor(category.color);
    setNewIcon(category.icon);
  };
  
  const handleDelete = (id: string) => {
    // Don't allow deleting default categories
    if (parseInt(id) <= 8) {
      toast.error("Cannot delete default categories");
      return;
    }
    
    if (confirm("Are you sure you want to delete this category? Transactions with this category will not be deleted, but they will no longer be categorized.")) {
      deleteCategory(id);
      toast.success("Category deleted successfully");
      resetForm();
    }
  };
  
  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewName('');
    setNewColor('#3B82F6');
    setNewIcon('folder');
  };
  
  // Predefined icon options
  const iconOptions = [
    { value: 'folder', label: 'Folder' },
    { value: 'utensils', label: 'Food' },
    { value: 'home', label: 'Home' },
    { value: 'car', label: 'Transportation' },
    { value: 'film', label: 'Entertainment' },
    { value: 'shopping-bag', label: 'Shopping' },
    { value: 'bolt', label: 'Utilities' },
    { value: 'heart-pulse', label: 'Healthcare' },
    { value: 'wallet', label: 'Income' },
    { value: 'gift', label: 'Gifts' },
    { value: 'book', label: 'Education' },
    { value: 'briefcase', label: 'Business' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Category Management</CardTitle>
        <CardDescription>
          Create and manage categories for your transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Category List */}
        <div className="space-y-2">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="flex items-center justify-between p-3 rounded-md border"
            >
              {editingId === category.id ? (
                // Edit Mode
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="edit-name">Name:</Label>
                    <Input 
                      id="edit-name" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="edit-color">Color:</Label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        id="edit-color" 
                        value={newColor} 
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-10 h-8 p-0 border-0"
                      />
                      <span 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: newColor }}
                      ></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="edit-icon">Icon:</Label>
                    <select 
                      id="edit-icon" 
                      value={newIcon} 
                      onChange={(e) => setNewIcon(e.target.value)}
                      className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleEditSubmit(category.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(category)}
                      disabled={parseInt(category.id) <= 8}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={parseInt(category.id) <= 8}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Add New Category Form */}
        {isAdding ? (
          <div className="mt-4 p-4 border rounded-md space-y-3">
            <h3 className="font-medium">Add New Category</h3>
            <div className="space-y-2">
              <div>
                <Label htmlFor="new-name">Name:</Label>
                <Input 
                  id="new-name" 
                  placeholder="Category Name" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-color">Color:</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="color" 
                    id="new-color" 
                    value={newColor} 
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-10 h-8 p-0 border-0"
                  />
                  <span 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: newColor }}
                  ></span>
                </div>
              </div>
              <div>
                <Label htmlFor="new-icon">Icon:</Label>
                <select 
                  id="new-icon" 
                  value={newIcon} 
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button 
                onClick={handleAddSubmit}
              >
                <Check className="h-4 w-4 mr-1" /> Add Category
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="mt-4 w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" /> Add New Category
          </Button>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Note: Default categories cannot be edited or deleted.
      </CardFooter>
    </Card>
  );
};

export default CategorySettings;
