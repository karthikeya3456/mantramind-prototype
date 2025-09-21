'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';

type AppointmentBookingDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sessionType: 'Virtual Consultation' | 'In-Person Meeting';
};

const availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
];

export function AppointmentBookingDialog({ isOpen, onOpenChange, sessionType }: AppointmentBookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [bookingState, setBookingState] = useState<'idle' | 'loading' | 'confirmed'>('idle');
  const { toast } = useToast();

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        title: 'Incomplete Information',
        description: 'Please select a date and time for your appointment.',
        variant: 'destructive',
      });
      return;
    }
    setBookingState('loading');
    // Simulate API call
    setTimeout(() => {
        setBookingState('confirmed');
    }, 1500);
  };
  
  const resetAndClose = () => {
    onOpenChange(false);
    // Add a small delay to allow the closing animation to finish before resetting state
    setTimeout(() => {
        setDate(new Date());
        setSelectedTime(undefined);
        setBookingState('idle');
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[425px]">
        {bookingState !== 'confirmed' ? (
          <>
            <DialogHeader>
              <DialogTitle>Book a {sessionType}</DialogTitle>
              <DialogDescription>
                Select a date and time that works for you. All times are in your local timezone.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                 <p className="text-sm font-medium col-span-4">Select a Date:</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal col-span-4',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm font-medium col-span-4">Select a Time:</p>
                <Select onValueChange={setSelectedTime} value={selectedTime}>
                    <SelectTrigger className="w-full col-span-4">
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTimes.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetAndClose}>Cancel</Button>
              <Button type="submit" onClick={handleBooking} disabled={!date || !selectedTime || bookingState === 'loading'}>
                {bookingState === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Booking
              </Button>
            </DialogFooter>
          </>
        ) : (
            <>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        Appointment Confirmed!
                    </DialogTitle>
                     <DialogDescription>
                        Your appointment has been successfully scheduled.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <p>
                        Your <span className="font-semibold">{sessionType}</span> is confirmed for:
                    </p>
                    <div className="p-4 bg-muted rounded-md text-center">
                        <p className="text-lg font-semibold">{date ? format(date, 'EEEE, MMMM d, yyyy') : ''}</p>
                        <p className="text-lg font-semibold">at {selectedTime}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        You will receive an email confirmation shortly. If you need to reschedule, please contact support.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={resetAndClose} className="w-full">Done</Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
