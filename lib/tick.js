export const Tick = {
    MIN: 1000*60, 
    HOUR: 1000*60*60, 
    DAY: 1000*60*60*24,
    WEEK_START: 4, // 3 for Monday, 4 for Sunday

    now: () => {
        const jsdate = new Date();
        return Date.now() - jsdate.getTimezoneOffset()*Tick.MIN;
    },

    fromTime: (time) => {
        const currentDate = new Date();
        if(time.year === undefined) time.year = currentDate.getFullYear();
        if(time.month === undefined) time.month = currentDate.getMonth();
        if(time.day === undefined) time.day = currentDate.getDate();
        if(time.hr === undefined) time.hr = 0;
        if(time.min === undefined) time.min = 0;
        if(time.sec === undefined) time.sec = 0;
        if(time.ms === undefined) time.ms = 0;

        let days = 0, year = time.year, leap = false;
        while (year != 1970) {
            year--;
            leap = (year%400 == 0) || ((year%4 == 0) && (year%100 != 0));
            days += leap? 366 : 365;
        }
        const daysinmonth = [ 31, leap? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        let month = time.month;
        while (month) { month --; days += daysinmonth[month]; }
        days += time.day;
        const hours = days*24 + time.hr;
        const mins = hours*60 + time.min;
        const secs = mins*60 + time.sec;
        return secs*1000 + time.ms;
    },

    toTime(tick) {
        const time = {};
        let days = Math.floor(tick/Tick.DAY), year = 1970, leap;
        time.weekday = (days + Tick.WEEK_START)%7;
        while (true) {
            leap = (year%400 == 0) || ((year%4 == 0) && (year%100 != 0));
            const daysinyear = leap? 366 : 365;
            if (days < daysinyear) break;
            days -= daysinyear; year++;
        }
        const daysinmonth = [ 31, leap? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        let month = 0;
        while (true) {
            const d = daysinmonth[month];
            if (days < d) break;
            days -= d; month++;
        }
        time.year = year; time.month = month; time.day = days;
        const ms = tick%Tick.DAY;
        time.ms = ms%1000; const sec = Math.floor(ms/1000); 
        time.sec = sec%60; const min = Math.floor(sec/60);
        time.min = min%60; time.hr = Math.floor(min/60);
        return time;
    },

    dayStart: (tick) => { return tick - tick%Tick.DAY; },
    
    weekStart: (tick) => {
        const days = Math.floor(tick/Tick.DAY);
        const weekday = (days + Tick.WEEK_START)%7;
        return (days - weekday) * Tick.DAY;
    },

    hourOfDay: (tick) => {
        return (tick%Tick.DAY)/Tick.HOUR;
    }
}
