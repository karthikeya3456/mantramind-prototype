import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Video } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a confidential session with a wellness professional at your convenience.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6" />
              <span>Virtual Consultation</span>
            </CardTitle>
            <CardDescription>30 minute one-on-one session via video call.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Connect with a professional from the comfort of your home. Our secure video platform ensures your privacy.
              This is a great option for follow-ups or when you need to talk to someone promptly.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" /> Book Virtual Session
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>In-Person Meeting</span>
            </CardTitle>
            <CardDescription>60 minute in-person session at our wellness center.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              For those who prefer a face-to-face conversation. Our wellness center provides a calm and safe environment
              for a deeper, more personal discussion.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" /> Book In-Person Session
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Powered by Google Calendar. You will be asked to connect your Google account.</p>
          <p>All appointments are strictly confidential.</p>
      </div>
    </div>
  );
}
