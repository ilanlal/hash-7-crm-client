import React, { useEffect, useRef, useState } from 'react'
import { Typography } from '@mui/material';
import { parseToTime, parseToTimer } from '../../utils';

interface TimerProps {
    expiredAt: number | 0;
    onExpired?: () => void;
    expiredOffsetMinutes: number | 5;
}

export default function Timer({ expiredAt, onExpired, expiredOffsetMinutes }: TimerProps) {
    // Countdown timer to refresh token
    const [time, setTime] = useState<string>(parseToTime(0));
    const setTimeRef = useRef(setTime);
    setTimeRef.current = setTime;
    const timerRef = useRef<any>();

    const onExpiredRef = useRef(onExpired);
    onExpiredRef.current = onExpired;

    const expiredOffsetMinutesRef = useRef(expiredOffsetMinutes);
    expiredOffsetMinutesRef.current = expiredOffsetMinutes;

    useEffect(() => {
        timerRef.current = setInterval(() => {
            if (expiredAt === 0) return;
            const utcNow = new Date().getTime();
            const distance = expiredAt ? expiredAt - utcNow : 0
            setTimeRef.current(parseToTimer(distance));
            if (distance < expiredOffsetMinutes * 60 * 1000) {
                clearInterval(timerRef.current);
                onExpiredRef.current && onExpiredRef.current();
                
            }
        }, 1000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [expiredAt, expiredOffsetMinutes]);


    return (
        <>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: '100px' }}>
                ⏳ {time} ⏰ {new Date(expiredAt || 0).toLocaleTimeString()}
            </Typography>
        </>
    )
};
