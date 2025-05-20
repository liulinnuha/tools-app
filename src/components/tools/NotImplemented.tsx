import React from 'react';
import { AlertTriangle, Clock, Lightbulb, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const NotImplemented: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Alert className="mb-6 max-w-xl mx-auto">
        <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
        <AlertTitle className="mb-2 text-amber-600 dark:text-amber-400">Tool Under Development</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          This tool is currently under development and will be available soon.
          We're working hard to bring you the best tools possible.
        </AlertDescription>
      </Alert>

      <Card className="p-6 max-w-xl mx-auto mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-start">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mr-4 text-blue-600 dark:text-blue-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              We're actively working on this tool and expect to have it ready in the coming weeks.
              Check back soon for updates!
            </p>
            <div className="flex items-center text-sm bg-blue-100 dark:bg-blue-900/40 p-3 rounded-md">
              <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
              <span>
                In the meantime, you might find similar functionality in our other available tools.
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link to="/all-tools">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Explore Other Tools
          </Link>
        </Button>

        <Button asChild variant="default">
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotImplemented;
