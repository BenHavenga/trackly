import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Upload,
  FileText,
  CheckCircle,
  Mail,
  MessageCircle,
} from "lucide-react";

export default function Help() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center gap-3 mb-4">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>How can we help you?</CardTitle>
          <CardDescription>
            Browse common topics below, or contact support if you need more
            help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="getting-started">
              <AccordionTrigger>Getting Started</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Welcome to the expense platform! Here’s how to get started:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Download the mobile app or use the web portal.</li>
                  <li>Log in with your company email and password.</li>
                  <li>
                    Set up your profile and notification preferences in
                    Settings.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="submitting-expenses">
              <AccordionTrigger>Submitting Expenses</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <span className="font-medium">How to submit an expense:</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>
                    Tap the <b>Add</b> button in the bottom menu.
                  </li>
                  <li>Upload a receipt or take a photo.</li>
                  <li>Fill in the details (amount, category, date, etc.).</li>
                  <li>Submit for approval or save as draft.</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="expense-reports">
              <AccordionTrigger>Expense Reports</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Managing your reports:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Group multiple expenses into a report from the Expenses
                    page.
                  </li>
                  <li>
                    Track the status of each report (pending, approved, paid).
                  </li>
                  <li>Download or view receipts for each item in a report.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="approvals-status">
              <AccordionTrigger>Approvals & Status</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">Understanding approvals:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Submitted reports are reviewed by your manager or approver.
                  </li>
                  <li>
                    You’ll receive notifications for approvals, rejections, or
                    comments.
                  </li>
                  <li>
                    Check the status anytime in the Expenses or Reports tab.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="contact-support">
              <AccordionTrigger>Contact Support</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-medium">Need more help?</span>
                </div>
                <p className="mb-2 text-sm">
                  If you have a question or issue not covered here, our support
                  team is ready to help.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:support@trackly.com">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Email Support
                  </a>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <div className="text-center pt-6">
        <Button asChild size="lg" className="gap-2">
          <a href="mailto:support@trackly.com">
            <MessageCircle className="h-5 w-5" />
            Contact Support
          </a>
        </Button>
      </div>
    </div>
  );
}
