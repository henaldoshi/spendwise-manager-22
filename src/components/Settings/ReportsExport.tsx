
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions, ReportType } from '@/context/TransactionContext';
import { format } from 'date-fns';
import { Download, FileText, FileSpreadsheet, Trash } from 'lucide-react';
import { toast } from "sonner";

const ReportsExport: React.FC = () => {
  const { generateReport, reports, deleteReport } = useTransactions();
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [reportFormat, setReportFormat] = useState<'csv' | 'pdf'>('csv');

  const handleGenerateReport = () => {
    generateReport(reportFormat, reportPeriod);
  };

  const handleDeleteReport = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
      toast.success("Report deleted successfully");
    }
  };

  const downloadReport = (report: ReportType) => {
    generateReport(report.format, report.period);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Generate Reports</CardTitle>
          <CardDescription>
            Create and download reports of your financial activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Period</label>
              <Select
                value={reportPeriod}
                onValueChange={(value: any) => setReportPeriod(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select
                value={reportFormat}
                onValueChange={(value: any) => setReportFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerateReport}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Report History</CardTitle>
          <CardDescription>
            View and download previously generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reports have been generated yet. Create your first report above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="flex items-center">
                      {report.format === 'csv' ? (
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      {report.name}
                    </TableCell>
                    <TableCell>
                      {report.format.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {report.period.charAt(0).toUpperCase() + report.period.slice(1)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(report.createdAt), 'MMM dd, yyyy - h:mm a')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => downloadReport(report)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Data Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Export All Data</CardTitle>
          <CardDescription>
            Export all your transactions as a CSV file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will export all your transaction data in CSV format, which can be imported into spreadsheet applications like Excel or Google Sheets.
          </p>
          <Button 
            onClick={() => {
              generateReport('csv', 'yearly');
              toast.success("All data has been exported to CSV");
            }}
            className="w-full"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export All Data (CSV)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsExport;
