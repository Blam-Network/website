"use client";

import { format } from "date-fns";

interface DateTimeDisplayProps {
    date: Date | string | number;
    formatString?: string;
}

/**
 * Client component for displaying dates/times in the user's local timezone.
 * This ensures dates are formatted correctly regardless of server timezone.
 */
export function DateTimeDisplay({ date, formatString = "MMM d, yyyy 'at' h:mm a" }: DateTimeDisplayProps) {
    // Convert to Date object if it's a string or number (from server serialization)
    const dateObj = date instanceof Date 
        ? date 
        : new Date(date as string | number | Date);
    
    // Format in the user's local timezone
    const formattedDate = format(dateObj, formatString);
    
    return <>{formattedDate}</>;
}

