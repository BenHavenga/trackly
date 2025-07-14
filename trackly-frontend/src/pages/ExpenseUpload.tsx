import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Camera,
  FileText,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ExpenseForm {
  description: string;
  amount: string;
  category: string;
  date: string;
  receipts: File[];
  notes: string;
}

const categories = [
  "Travel",
  "Meals",
  "Office Supplies",
  "Software",
  "Training",
  "Transportation",
  "Accommodation",
  "Equipment",
  "Marketing",
  "Other",
];

const categoryToGLCode: Record<string, string> = {
  Travel: "6001",
  Meals: "6002",
  "Office Supplies": "6003",
  Software: "6004",
  Training: "6005",
  Transportation: "6006",
  Accommodation: "6007",
  Equipment: "6008",
  Marketing: "6009",
  Other: "6010",
};

export function ExpenseUpload() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<ExpenseForm>({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    receipts: [],
    notes: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateForm = (field: keyof ExpenseForm, value: string | File[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      updateForm("receipts", [...form.receipts, ...newFiles]);
    }
  };

  const removeReceipt = (index: number) => {
    const newReceipts = form.receipts.filter((_, i) => i !== index);
    updateForm("receipts", newReceipts);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedFromStep1 = form.receipts.length > 0;
  const canProceedFromStep2 = form.description && form.amount && form.category;

  const submitExpense = (action: "draft" | "submit") => {
    if (!canProceedFromStep2) return;

    toast({
      title: action === "draft" ? "Saved as draft" : "Expense submitted",
      description:
        action === "draft"
          ? "Your expense has been saved as a draft. You can complete it later."
          : "Your expense has been submitted for approval.",
    });

    navigate("/dashboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4 md:space-y-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Upload Expense
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Follow the 3-step wizard to submit your expense for approval.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="w-full sm:w-auto min-h-[48px] text-base font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Progress Indicator - Improved mobile layout */}
      <Card>
        <CardContent className="pt-6">
          {/* Mobile progress indicator */}
          <div className="md:hidden space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-sm">
                Step {currentStep} of 3
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentStep === 1 && "Upload Receipt"}
                {currentStep === 2 && "Enter Details"}
                {currentStep === 3 && "Review & Submit"}
              </span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Upload</span>
              <span>Details</span>
              <span>Submit</span>
            </div>
          </div>

          {/* Desktop progress indicator */}
          <div className="hidden md:block">
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center justify-center w-full">
                {[1, 2, 3].map((step, idx) => {
                  const isCompleted = step < currentStep;
                  const isActive = step === currentStep;
                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center flex-1 min-w-[100px]"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold border-2 transition-colors duration-200
                          ${
                            isCompleted
                              ? "bg-primary text-primary-foreground border-primary"
                              : isActive
                              ? "bg-background text-primary border-primary"
                              : "bg-muted text-muted-foreground border-muted-foreground/30"
                          }
                        `}
                        aria-current={isActive ? "step" : undefined}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {step === 1 && "Upload"}
                        {step === 2 && "Details"}
                        {step === 3 && "Submit"}
                      </span>
                      {step < 3 && (
                        <div
                          className={`absolute left-full top-1/2 -translate-y-1/2 w-16 h-1 ${
                            isCompleted ? "bg-primary" : "bg-muted"
                          }`}
                          style={{ marginLeft: "-8px", marginRight: "-8px" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <Badge variant="outline" className="mt-4">
                Step {currentStep} of 3
              </Badge>
            </div>
            <Progress value={(currentStep / 3) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Upload Receipt */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 1: Upload Receipt
            </CardTitle>
            <CardDescription>
              Upload your receipt or take a photo. You can add multiple receipts
              for this expense.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Improved file upload area */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 md:p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                  <Camera className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                  <FileText className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    Upload Receipt
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    Drag and drop your receipt here, or click to browse
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                  <Button
                    onClick={() =>
                      document.getElementById("receipt-upload")?.click()
                    }
                    className="w-full min-h-[48px] text-base font-medium"
                  >
                    Choose Files
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full min-h-[48px] text-base font-medium"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <input
                  id="receipt-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>
            </div>

            {/* Uploaded receipts list */}
            {form.receipts.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">
                  Uploaded Receipts ({form.receipts.length})
                </h4>
                <div className="space-y-3">
                  {form.receipts.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <FileText className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm md:text-base truncate">
                            {file.name}
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReceipt(index)}
                        className="flex-shrink-0 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={nextStep}
                disabled={!canProceedFromStep1}
                className="flex items-center gap-2 min-h-[48px] text-base font-medium w-full sm:w-auto"
              >
                Next: Enter Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Enter Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Step 2: Enter Expense Details
            </CardTitle>
            <CardDescription>
              Provide the details of your expense including amount, category,
              and description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Improved form layout */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the expense"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className="min-h-[48px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => updateForm("amount", e.target.value)}
                  className="min-h-[48px] text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => updateForm("category", value)}
                >
                  <SelectTrigger className="min-h-[48px] text-base">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GL Code (read-only, autofilled) */}
              <div className="space-y-2">
                <Label htmlFor="glcode">GL Code</Label>
                <Input
                  id="glcode"
                  value={
                    form.category ? categoryToGLCode[form.category] || "" : ""
                  }
                  readOnly
                  disabled
                  className="min-h-[48px] text-base bg-muted cursor-not-allowed"
                  placeholder="Select a category to autofill"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => updateForm("date", e.target.value)}
                  className="min-h-[48px] text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this expense..."
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
                rows={3}
                className="text-base"
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2 min-h-[48px] text-base font-medium w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!canProceedFromStep2}
                className="flex items-center gap-2 min-h-[48px] text-base font-medium w-full sm:w-auto"
              >
                Next: Review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Step 3: Review & Submit
            </CardTitle>
            <CardDescription>
              Review your expense details before submitting for approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Improved review layout */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h4 className="font-medium mb-4">Expense Details</h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Description
                    </Label>
                    <p className="font-medium text-base">{form.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Amount
                    </Label>
                    <p className="font-medium text-lg md:text-xl">
                      ${parseFloat(form.amount || "0").toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Category
                    </Label>
                    <p className="font-medium text-base">{form.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Date
                    </Label>
                    <p className="font-medium text-base">{form.date}</p>
                  </div>
                  {form.notes && (
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Notes
                      </Label>
                      <p className="font-medium text-base">{form.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">
                  Receipts ({form.receipts.length})
                </h4>
                <div className="space-y-3">
                  {form.receipts.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What happens next section */}
            <div className="bg-muted p-4 md:p-6 rounded-lg">
              <h4 className="font-medium mb-3 text-base">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Your expense will be sent to your approver for review
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  You'll receive an email notification when it's approved or
                  rejected
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Approved expenses will be processed for payment by finance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  You can track the status in your dashboard
                </li>
              </ul>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2 min-h-[48px] text-base font-medium w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => submitExpense("draft")}
                  className="min-h-[48px] text-base font-medium w-full sm:w-auto"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => submitExpense("submit")}
                  className="flex items-center gap-2 min-h-[48px] text-base font-medium w-full sm:w-auto"
                >
                  <CheckCircle className="h-4 w-4" />
                  Submit for Approval
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
